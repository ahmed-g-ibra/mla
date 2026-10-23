'use client';

import Link from 'next/link';
import { useShop } from '@/lib/shop-store';
import type { Locale } from '@/data/products';
import { CartIcon } from './Icons';

export function CartCount({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const { count, ready } = useShop();

  return (
    <Link
      href={`/${locale}/cart`}
      className="relative inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 rounded-sm px-2.5 text-sm font-medium text-ink-700 transition-colors duration-200 hover:bg-papyrus-200 hover:text-lapis-700"
      aria-label={ready && count > 0 ? `${label} (${count})` : label}
    >
      <CartIcon />
      <span className="hidden sm:inline">{label}</span>
      {ready && count > 0 && (
        <span
          aria-hidden="true"
          className="absolute end-0.5 top-1 min-w-[1.15rem] rounded-full bg-carnelian-600 px-1 text-center text-[0.68rem] leading-[1.15rem] font-bold text-papyrus-50 tabular-nums"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
