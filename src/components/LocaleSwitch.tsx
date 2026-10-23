'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/data/products';
import { GlobeIcon } from './Icons';

/**
 * Swaps the first path segment, so the visitor stays on the page they were
 * reading rather than being sent back to the home page.
 */
export function LocaleSwitch({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname() || `/${locale}`;
  const other: Locale = locale === 'en' ? 'ar' : 'en';
  const segments = pathname.split('/');
  segments[1] = other;
  const href = segments.join('/') || `/${other}`;

  return (
    <Link
      href={href}
      lang={other}
      hrefLang={other}
      aria-label={`${label}: ${other === 'ar' ? 'العربية' : 'English'}`}
      className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-sm px-2.5 text-sm font-medium text-ink-700 transition-colors duration-200 hover:bg-papyrus-200 hover:text-lapis-700"
    >
      <GlobeIcon className="h-4 w-4" />
      <span>{other === 'ar' ? 'العربية' : 'English'}</span>
    </Link>
  );
}
