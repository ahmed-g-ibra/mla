'use client';

import { productBySlug, type Locale } from '@/data/products';
import { currencyByCode, formatMoney, type Currency } from './currency';
import type { Dictionary } from './i18n';
import { SITE_URL } from './seo';
import { storeConfig } from './store-config';
import type { CartLine } from './shop-store';

const LAST_ORDER_KEY = 'mla.lastOrder.v1';

/**
 * A plain order record.
 *
 * Nothing is charged on the site today, but an order still needs an identity
 * the customer and we can both quote. Keeping it in this shape — lines, totals
 * and tax resolved at the moment of ordering rather than recomputed later —
 * is also what a payment provider will want when one is added, so the funnel
 * does not have to be rebuilt around it.
 */
export type Order = {
  reference: string;
  placedAt: string;
  currency: string;
  locale: Locale;
  lines: { slug: string; name: string; qty: number; totalUsd: number }[];
  subtotalUsd: number;
  vatUsd: number;
  totalUsd: number;
};

/**
 * MLA-YYMMDD-XXXX. Short enough to read down a phone line, dated so an old
 * reference is obviously old, and random enough not to collide within a day.
 */
export function makeReference(now = new Date()): string {
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const alphabet = 'ACDEFGHJKLMNPQRTUVWXY349'; // no look-alike characters
  let tail = '';
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  for (const b of bytes) tail += alphabet[b % alphabet.length];
  return `MLA-${yy}${mm}${dd}-${tail}`;
}

export function buildOrder(
  lines: CartLine[],
  currency: Currency,
  locale: Locale,
): Order {
  const resolved = lines
    .map((l) => ({ line: l, product: productBySlug(l.slug) }))
    .filter((r) => r.product);

  const orderLines = resolved.map(({ line, product }) => ({
    slug: line.slug,
    name: product!.name[locale],
    qty: line.qty,
    totalUsd: product!.priceUsd * line.qty,
  }));

  const totalUsd = orderLines.reduce((sum, l) => sum + l.totalUsd, 0);
  // Catalogue prices are VAT-inclusive, as Oman requires, so the tax is backed
  // out of the total rather than added on top.
  const vatUsd = totalUsd - totalUsd / (1 + storeConfig.vatRate);

  return {
    reference: makeReference(),
    placedAt: new Date().toISOString(),
    currency: currency.code,
    locale,
    lines: orderLines,
    subtotalUsd: totalUsd - vatUsd,
    vatUsd,
    totalUsd,
  };
}

/**
 * The message a person actually reads on their phone.
 *
 * Each line carries its product link. A click-to-chat link can only prefill
 * text — there is no parameter for attaching an image on either wa.me or
 * api.whatsapp.com, and only the paid Business API can send media. But
 * WhatsApp renders a preview card for the first URL in a message, and every
 * product has a share card built for exactly that shape, so the order arrives
 * with a picture of at least the first piece and a tappable link to each one.
 */
export function orderMessage(order: Order, dict: Dictionary): string {
  const currency = currencyByCode(order.currency);
  const money = (usd: number) => formatMoney(usd, currency, order.locale);
  const link = (slug: string) =>
    `${SITE_URL}/${order.locale}/products/${slug}`;

  const lines = order.lines.flatMap((l) => [
    `• ${l.name} × ${l.qty} — ${money(l.totalUsd)}`,
    link(l.slug),
    '',
  ]);

  return [
    dict.cart.whatsappIntro,
    `${dict.order.reference}: ${order.reference}`,
    '',
    ...lines,
    `${dict.cart.whatsappTotal}: ${money(order.totalUsd)}`,
    `(${dict.vat.ofWhich} ${money(order.vatUsd)})`,
    '',
    dict.cart.whatsappOutro,
  ].join('\n');
}

const readLastOrder = (): Order | null => {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
};

/**
 * The confirmation page reads the order through useSyncExternalStore rather
 * than an effect, for the same reason the cart does: the server cannot see
 * localStorage, so the first render has to be the neutral snapshot and the
 * client swaps in the real one. `ready` is what separates "no order" from
 * "not looked yet", which decides whether the empty state is shown.
 */
export type LastOrderState = { order: Order | null; ready: boolean };

const SERVER_STATE: LastOrderState = { order: null, ready: false };
let clientState: LastOrderState | null = null;
const listeners = new Set<() => void>();

export const subscribeLastOrder = (onChange: () => void) => {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
};

export const getLastOrderSnapshot = (): LastOrderState => {
  if (!clientState) clientState = { order: readLastOrder(), ready: true };
  return clientState;
};

export const getLastOrderServerSnapshot = (): LastOrderState => SERVER_STATE;

export const saveLastOrder = (order: Order) => {
  try {
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {}
  // Keep the snapshot in step, so a second order in the same session does not
  // land on the first order's confirmation page.
  clientState = { order, ready: true };
  for (const l of listeners) l();
};
