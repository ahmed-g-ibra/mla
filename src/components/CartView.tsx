'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { productBySlug, type Locale } from '@/data/products';
import { formatMoney } from '@/lib/currency';
import type { Dictionary } from '@/lib/i18n';
import { IMAGE_BLUR } from '@/lib/image';
import { buildOrder, orderMessage, saveLastOrder } from '@/lib/order';
import { useShop } from '@/lib/shop-store';
import { storeConfig, whatsappLink } from '@/lib/store-config';
import { CloseIcon, WhatsAppIcon } from './Icons';
import { GLYPHS, Glyph } from './Glyph';

export function CartView({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { lines, setQty, remove, clear, currency, ready } = useShop();
  const router = useRouter();

  const rows = lines
    .map((l) => ({ line: l, product: productBySlug(l.slug) }))
    .filter((r): r is { line: typeof r.line; product: NonNullable<typeof r.product> } =>
      Boolean(r.product),
    );

  const subtotalUsd = rows.reduce(
    (sum, r) => sum + r.product.priceUsd * r.line.qty,
    0,
  );

  // Catalogue prices are VAT-inclusive, as Oman requires, so the tax is shown
  // broken out of the total rather than added to it.
  const vatUsd = subtotalUsd - subtotalUsd / (1 + storeConfig.vatRate);

  /**
   * The order is built during render, not on click, so the checkout control
   * can be a real anchor carrying a real href.
   *
   * It used to call window.open() from a handler. That is a programmatic
   * popup, and mobile Safari and the Instagram and Facebook in-app browsers
   * block those — which is most of the Gulf. Worse, the router.push() that
   * followed navigated this page away immediately, which can cancel the
   * hand-off even where the popup survived. A plain link is never blocked.
   *
   * Rebuilding whenever the cart changes is deliberate: a different basket is
   * a different order and deserves its own reference.
   */
  const order = useMemo(
    () => (lines.length > 0 ? buildOrder(lines, currency, locale) : null),
    [lines, currency, locale],
  );

  const onCheckout = () => {
    if (!order) return;
    saveLastOrder(order);
    // Let the browser start opening WhatsApp before this page moves on.
    setTimeout(() => {
      clear();
      router.push(`/${locale}/order-sent`);
    }, 200);
  };

  if (!ready) {
    return <div className="py-24" aria-hidden="true" />;
  }

  if (rows.length === 0) {
    return (
      <div className="py-20 text-center">
        <Glyph char={GLYPHS.djed} className="text-4xl text-papyrus-400" />
        <p className="mt-4 text-lg text-ink-500">{dict.cart.empty}</p>
        <Link
          href={`/${locale}/collections`}
          className="mt-6 inline-flex min-h-12 cursor-pointer items-center rounded-sm bg-lapis-800 px-6 font-semibold text-papyrus-50 transition-colors duration-200 hover:bg-lapis-900"
        >
          {dict.cart.emptyCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <ul className="divide-y divide-papyrus-300 border-y border-papyrus-300">
        {rows.map(({ line, product }) => (
          <li key={line.slug} className="flex gap-4 py-5">
            <Link
              href={`/${locale}/products/${product.slug}`}
              className="relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-sm border border-papyrus-300 bg-white"
            >
              <Image
                src={product.images[0]}
                alt=""
                fill
                sizes="96px"
                className="object-contain p-1.5"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR}
          />
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/${locale}/products/${product.slug}`}
                className="cursor-pointer font-semibold text-ink-900 transition-colors duration-200 hover:text-lapis-700"
              >
                {product.name[locale]}
              </Link>
              <p className="mt-0.5 text-sm text-ink-500">
                {product.material[locale]} · <bdi>{product.heightCm} cm</bdi>
              </p>
              {line.qty > 1 && (
                <p className="mt-0.5 text-sm text-ink-500 tabular-nums">
                  {formatMoney(product.priceUsd, currency, locale)}{' '}
                  {dict.cart.each}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center rounded-sm border border-papyrus-300">
                  <button
                    type="button"
                    onClick={() => setQty(line.slug, line.qty - 1)}
                    aria-label={dict.cart.decrease}
                    className="h-11 w-11 cursor-pointer text-lg font-semibold text-ink-700 transition-colors duration-200 hover:bg-papyrus-200"
                  >
                    −
                  </button>
                  <span
                    className="w-10 text-center font-semibold tabular-nums"
                    aria-label={dict.cart.quantity}
                  >
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(line.slug, line.qty + 1)}
                    aria-label={dict.cart.increase}
                    className="h-11 w-11 cursor-pointer text-lg font-semibold text-ink-700 transition-colors duration-200 hover:bg-papyrus-200"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => remove(line.slug)}
                  className="inline-flex min-h-11 cursor-pointer items-center gap-1 text-sm font-medium text-ink-500 transition-colors duration-200 hover:text-carnelian-600"
                >
                  <CloseIcon className="h-4 w-4" />
                  {dict.cart.remove}
                </button>
              </div>
            </div>

            <p className="shrink-0 font-semibold tabular-nums text-ink-900">
              {formatMoney(product.priceUsd * line.qty, currency, locale)}
            </p>
          </li>
        ))}
      </ul>

      <aside className="papyrus-grain h-fit rounded-sm border border-papyrus-300 p-6">
        <h2 className="text-lg font-semibold text-ink-900">
          {dict.cart.summary}
        </h2>
        <div className="register-rule mt-3 w-24" />

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">{dict.cart.subtotal}</dt>
            <dd className="font-medium tabular-nums">
              {formatMoney(subtotalUsd, currency, locale)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">{dict.cart.shipping}</dt>
            <dd className="font-medium text-malachite-700">
              {dict.cart.shippingFree}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-papyrus-300 pt-3 text-base">
            <dt className="font-semibold">{dict.cart.total}</dt>
            <dd className="font-semibold tabular-nums">
              {formatMoney(subtotalUsd, currency, locale)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 text-xs text-ink-500">
            <dt>{dict.vat.ofWhich}</dt>
            <dd className="tabular-nums">
              {formatMoney(vatUsd, currency, locale)}
            </dd>
          </div>
        </dl>

        <a
          href={order ? whatsappLink(orderMessage(order, dict)) : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onCheckout}
          className="mt-6 inline-flex min-h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-malachite-600 px-5 text-center font-semibold text-papyrus-50 transition-colors duration-200 hover:bg-malachite-700"
        >
          <WhatsAppIcon />
          {dict.cart.checkout}
        </a>

        <p className="mt-3 text-xs leading-relaxed text-ink-500">
          {dict.cart.checkoutNote}
        </p>

        <Link
          href={`/${locale}/collections`}
          className="mt-4 inline-flex min-h-11 cursor-pointer items-center text-sm font-medium text-lapis-700 underline decoration-gold-500 underline-offset-4 transition-colors duration-200 hover:text-carnelian-600"
        >
          {dict.cart.continue}
        </Link>
      </aside>
    </div>
  );
}
