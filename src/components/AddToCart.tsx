'use client';

import { useEffect, useState } from 'react';
import type { Locale, Product } from '@/data/products';
import { formatMoney } from '@/lib/currency';
import type { Dictionary } from '@/lib/i18n';
import { useShop } from '@/lib/shop-store';
import { CartIcon } from './Icons';

function QuantityStepper({
  qty,
  setQty,
  dict,
}: {
  qty: number;
  setQty: (n: number) => void;
  dict: Dictionary;
}) {
  return (
    <div className="inline-flex items-center rounded-sm border border-papyrus-300">
      <button
        type="button"
        onClick={() => setQty(Math.max(1, qty - 1))}
        aria-label={dict.cart.decrease}
        disabled={qty <= 1}
        className="h-13 w-12 cursor-pointer text-lg font-semibold text-ink-700 transition-colors duration-200 hover:bg-papyrus-200 disabled:cursor-not-allowed disabled:text-ink-400"
      >
        −
      </button>
      <span
        className="w-10 text-center font-semibold tabular-nums"
        aria-label={dict.product.quantity}
      >
        {qty}
      </span>
      <button
        type="button"
        onClick={() => setQty(Math.min(99, qty + 1))}
        aria-label={dict.cart.increase}
        className="h-13 w-12 cursor-pointer text-lg font-semibold text-ink-700 transition-colors duration-200 hover:bg-papyrus-200"
      >
        +
      </button>
    </div>
  );
}

export function AddToCart({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const { add, currency } = useShop();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 2200);
    return () => clearTimeout(t);
  }, [justAdded]);

  const addNow = () => {
    add(product.slug, qty);
    setJustAdded(true);
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <QuantityStepper qty={qty} setQty={setQty} dict={dict} />
        <button
          type="button"
          onClick={addNow}
          className="inline-flex min-h-13 flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-lapis-800 px-6 text-base font-semibold text-papyrus-50 transition-colors duration-200 hover:bg-lapis-900"
        >
          <CartIcon />
          {justAdded ? dict.product.added : dict.product.addToCart}
        </button>
      </div>
      <p className="mt-2 text-xs text-ink-500">{dict.vat.included}</p>
      {/* Announced on change so screen readers get the confirmation too. */}
      <span aria-live="polite" className="sr-only">
        {justAdded ? dict.product.added : ''}
      </span>

      {/* On a phone the description pushes the real button off screen, so the
          action follows the customer down the page. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-papyrus-300 bg-papyrus-50/97 px-4 py-2.5 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink-900">
              {product.name[locale]}
            </p>
            <p className="text-sm font-semibold tabular-nums text-ink-900">
              {formatMoney(product.priceUsd, currency, locale)}
            </p>
          </div>
          <button
            type="button"
            onClick={addNow}
            aria-label={`${dict.product.addToCart}: ${product.name[locale]}`}
            className="inline-flex min-h-12 shrink-0 cursor-pointer items-center gap-2 rounded-sm bg-lapis-800 px-5 font-semibold text-papyrus-50 transition-colors duration-200 hover:bg-lapis-900"
          >
            <CartIcon />
            {justAdded ? dict.product.added : dict.product.addToCart}
          </button>
        </div>
      </div>
      {/* Keeps the sticky bar from covering the footer's last line. */}
      <div aria-hidden="true" className="h-20 lg:hidden" />
    </>
  );
}
