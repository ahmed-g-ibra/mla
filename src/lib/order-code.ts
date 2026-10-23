import { productBySlug, type Locale } from '@/data/products';
import { currencyByCode, type Currency } from './currency';
import { storeConfig } from './store-config';

/**
 * An order packed into a URL path segment.
 *
 * It has to live in the path rather than the query, because Next hands
 * opengraph-image.tsx only `params` — a query string is invisible to it, and
 * the whole point is a preview card that knows what was ordered.
 *
 * Only slugs and quantities travel. Prices are always recomputed from the
 * catalogue on arrival, so a hand-edited link cannot invent a total.
 */
export type DecodedOrder = {
  reference: string;
  currency: Currency;
  locale: Locale;
  lines: { slug: string; qty: number; name: string; totalUsd: number }[];
  subtotalUsd: number;
  vatUsd: number;
  totalUsd: number;
};

const toBase64Url = (text: string): string => {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  const b64 =
    typeof btoa === 'function'
      ? btoa(binary)
      : Buffer.from(bytes).toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (code: string): string => {
  const b64 = code.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  if (typeof atob === 'function') {
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  return Buffer.from(padded, 'base64').toString('utf8');
};

/** `reference|currency|slug:qty,slug:qty` — compact, then base64url. */
export function encodeOrder(
  reference: string,
  currencyCode: string,
  lines: { slug: string; qty: number }[],
): string {
  const items = lines.map((l) => `${l.slug}:${l.qty}`).join(',');
  return toBase64Url(`${reference}|${currencyCode}|${items}`);
}

export function decodeOrder(
  code: string,
  locale: Locale,
): DecodedOrder | null {
  let raw: string;
  try {
    raw = fromBase64Url(code);
  } catch {
    return null;
  }

  const [reference, currencyCode, items] = raw.split('|');
  if (!reference || !currencyCode || !items) return null;
  if (!/^MLA-\d{6}-[A-Z0-9]{4}$/.test(reference)) return null;

  const lines: DecodedOrder['lines'] = [];
  for (const part of items.split(',')) {
    const [slug, rawQty] = part.split(':');
    const product = productBySlug(slug);
    if (!product) continue;
    const qty = Math.min(Math.max(parseInt(rawQty, 10) || 0, 1), 99);
    lines.push({
      slug,
      qty,
      name: product.name[locale],
      totalUsd: product.priceUsd * qty,
    });
  }
  if (lines.length === 0) return null;

  const totalUsd = lines.reduce((sum, l) => sum + l.totalUsd, 0);
  const vatUsd = totalUsd - totalUsd / (1 + storeConfig.vatRate);

  return {
    reference,
    currency: currencyByCode(currencyCode),
    locale,
    lines,
    subtotalUsd: totalUsd - vatUsd,
    vatUsd,
    totalUsd,
  };
}
