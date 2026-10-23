'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import type { Locale } from '@/data/products';
import { GlobeIcon } from './Icons';

/**
 * Read through useSyncExternalStore rather than useSearchParams: the header
 * sits in the layout of every statically prerendered page, and useSearchParams
 * would push all of them out of static rendering. The server snapshot is
 * empty, so the link starts out bare and picks the query up after hydration.
 */
const subscribeToUrl = (onChange: () => void) => {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
};
const getQuery = () => window.location.search;
const getServerQuery = () => '';

/**
 * Swaps the first path segment, so the visitor stays on the page they were
 * reading rather than being sent back to the home page — and keeps whatever
 * they had filtered or sorted.
 */
export function LocaleSwitch({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname() || `/${locale}`;
  const query = useSyncExternalStore(subscribeToUrl, getQuery, getServerQuery);
  const other: Locale = locale === 'en' ? 'ar' : 'en';
  const segments = pathname.split('/');
  segments[1] = other;
  const href = (segments.join('/') || `/${other}`) + query;

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
