import { NextResponse } from 'next/server';
import { productBySlug } from '@/data/products';
import { currencyByCode } from '@/lib/currency';
import { getOrderStore } from '@/lib/orders/store';
import type { StoredOrder } from '@/lib/orders/types';
import { storeConfig } from '@/lib/store-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REFERENCE = /^MLA-\d{6}-[A-Z0-9]{4}$/;
const MAX_LINES = 40;

/**
 * Records an order at checkout.
 *
 * Only the reference, the currency, the locale and a list of slugs and
 * quantities are accepted. Names, prices, tax and totals are all recomputed
 * from the catalogue here — a posted price is a number a stranger chose, and
 * this is the figure that ends up in the books.
 */
export async function POST(request: Request) {
  const store = getOrderStore();
  // No database configured: the shop still works, it just keeps no record.
  if (!store) return NextResponse.json({ recorded: false }, { status: 202 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { reference, currency, locale, lines } = (body ?? {}) as {
    reference?: string;
    currency?: string;
    locale?: string;
    lines?: { slug?: string; qty?: number }[];
  };

  if (!reference || !REFERENCE.test(reference)) {
    return NextResponse.json({ error: 'bad reference' }, { status: 400 });
  }
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_LINES) {
    return NextResponse.json({ error: 'bad lines' }, { status: 400 });
  }

  const resolved: StoredOrder['lines'] = [];
  for (const line of lines) {
    const product = line?.slug ? productBySlug(line.slug) : undefined;
    if (!product) continue;
    const qty = Math.min(Math.max(Math.floor(Number(line.qty) || 0), 1), 99);
    resolved.push({
      slug: product.slug,
      qty,
      name: product.name.en,
      unitUsd: product.priceUsd,
      totalUsd: product.priceUsd * qty,
    });
  }
  if (resolved.length === 0) {
    return NextResponse.json({ error: 'no known products' }, { status: 400 });
  }

  const totalUsd = resolved.reduce((sum, l) => sum + l.totalUsd, 0);
  // Catalogue prices are VAT-inclusive, so the tax comes out of the total.
  const vatUsd = totalUsd - totalUsd / (1 + storeConfig.vatRate);
  const now = new Date().toISOString();

  const order: StoredOrder = {
    reference,
    placedAt: now,
    updatedAt: now,
    locale: locale === 'ar' ? 'ar' : 'en',
    currency: currencyByCode(String(currency ?? '')).code,
    status: 'new',
    lines: resolved,
    subtotalUsd: Number((totalUsd - vatUsd).toFixed(2)),
    vatUsd: Number(vatUsd.toFixed(2)),
    totalUsd: Number(totalUsd.toFixed(2)),
    notes: [],
  };

  try {
    await store.init();
    await store.save(order);
  } catch (error) {
    // Never let bookkeeping break a sale: the customer is already on their
    // way to WhatsApp and must not see this fail.
    console.error('order record failed', error);
    return NextResponse.json({ recorded: false }, { status: 202 });
  }

  return NextResponse.json({ recorded: true, reference }, { status: 201 });
}
