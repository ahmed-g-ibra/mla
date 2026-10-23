'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import type { Locale } from '@/data/products';
import { currencyByCode, formatMoney } from '@/lib/currency';
import type { Dictionary } from '@/lib/i18n';
import {
  getLastOrderServerSnapshot,
  getLastOrderSnapshot,
  orderMessage,
  subscribeLastOrder,
} from '@/lib/order';
import { whatsappLink } from '@/lib/store-config';
import { GLYPHS, Glyph } from './Glyph';
import { WhatsAppIcon } from './Icons';

export function OrderSent({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { order, ready } = useSyncExternalStore(
    subscribeLastOrder,
    getLastOrderSnapshot,
    getLastOrderServerSnapshot,
  );

  if (!ready) return <div className="py-24" aria-hidden="true" />;

  if (!order) {
    return (
      <div className="py-16 text-center">
        <Glyph char={GLYPHS.djed} className="text-4xl text-papyrus-400" />
        <p className="mt-4 text-ink-500">{dict.cart.empty}</p>
        <Link
          href={`/${locale}/collections`}
          className="mt-6 inline-flex min-h-12 cursor-pointer items-center rounded-sm bg-lapis-800 px-6 font-semibold text-papyrus-50 transition-colors duration-200 hover:bg-lapis-900"
        >
          {dict.order.backToShop}
        </Link>
      </div>
    );
  }

  const currency = currencyByCode(order.currency);

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <p className="text-[1.05rem] leading-relaxed text-ink-700">
          {dict.order.sentBody}
        </p>

        <div className="papyrus-grain mt-6 rounded-sm border border-papyrus-300 p-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-ink-500 uppercase">
            {dict.order.reference}
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold tracking-wide text-lapis-800">
            {order.reference}
          </p>
          <p className="mt-2 text-sm text-ink-500">
            {dict.order.keepReference}
          </p>
        </div>

        <h2 className="mt-10 text-xl font-semibold text-ink-900">
          {dict.order.whatNext}
        </h2>
        <div className="register-rule mt-3 w-24" />
        <ol className="mt-5 space-y-3">
          {dict.order.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-ink-700">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lapis-800 text-xs font-bold text-papyrus-50 tabular-nums"
              >
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-sm text-ink-500">{dict.order.sentNotOpened}</p>
        <a
          href={whatsappLink(orderMessage(order, dict))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-sm border border-malachite-600 px-5 font-semibold text-malachite-700 transition-colors duration-200 hover:bg-malachite-600 hover:text-papyrus-50"
        >
          <WhatsAppIcon />
          {dict.order.sendAgain}
        </a>
      </div>

      <aside className="papyrus-grain h-fit rounded-sm border border-papyrus-300 p-6">
        <h2 className="text-lg font-semibold text-ink-900">
          {dict.cart.summary}
        </h2>
        <div className="register-rule mt-3 w-24" />
        <ul className="mt-5 space-y-3 text-sm">
          {order.lines.map((l) => (
            <li key={l.slug} className="flex justify-between gap-4">
              <span className="text-ink-700">
                {l.name} × {l.qty}
              </span>
              <span className="shrink-0 font-medium tabular-nums">
                {formatMoney(l.totalUsd, currency, locale)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-papyrus-300 pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">{dict.cart.shipping}</dt>
            <dd className="font-medium text-malachite-700">
              {dict.cart.shippingFree}
            </dd>
          </div>
          <div className="flex justify-between gap-4 text-base">
            <dt className="font-semibold">{dict.cart.total}</dt>
            <dd className="font-semibold tabular-nums">
              {formatMoney(order.totalUsd, currency, locale)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 text-xs text-ink-500">
            <dt>{dict.vat.ofWhich}</dt>
            <dd className="tabular-nums">
              {formatMoney(order.vatUsd, currency, locale)}
            </dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
