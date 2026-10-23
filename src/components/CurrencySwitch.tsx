'use client';

import { currencies, type CurrencyCode } from '@/lib/currency';
import { useShop } from '@/lib/shop-store';
import type { Locale } from '@/data/products';
import { CoinIcon } from './Icons';

export function CurrencySwitch({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const { currency, setCurrency } = useShop();

  return (
    <label className="relative inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-sm px-2.5 text-sm font-medium text-ink-700 transition-colors duration-200 hover:bg-papyrus-200 hover:text-lapis-700">
      <CoinIcon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
      <select
        value={currency.code}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="cursor-pointer appearance-none bg-transparent pe-4 font-medium text-current focus:outline-none"
        aria-label={label}
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} · {c.country[locale]}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="pointer-events-none absolute end-1 h-3.5 w-3.5"
      >
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </label>
  );
}
