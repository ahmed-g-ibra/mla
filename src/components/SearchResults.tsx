'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { products as allProducts, type Locale } from '@/data/products';
import type { Dictionary } from '@/lib/i18n';
import { searchProducts } from '@/lib/search';
import { CloseIcon, SearchIcon } from './Icons';
import { ProductCard } from './ProductCard';

/**
 * ?q= is read from the address bar rather than useSearchParams, for the same
 * reason the catalogue filters are: this page stays statically rendered.
 */
const subscribeToUrl = (onChange: () => void) => {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
};
const getQuery = () => window.location.search;
const getServerQuery = () => '';

const readQ = (search: string) =>
  new URLSearchParams(search).get('q')?.slice(0, 80) ?? '';

export function SearchResults({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const urlQuery = useSyncExternalStore(
    subscribeToUrl,
    getQuery,
    getServerQuery,
  );

  const [q, setQ] = useState('');
  const [lastUrl, setLastUrl] = useState('');
  if (urlQuery !== lastUrl) {
    setLastUrl(urlQuery);
    setQ(readQ(urlQuery));
  }

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Someone who landed here came to type.
    inputRef.current?.focus();
  }, []);

  const hits = useMemo(() => searchProducts(q, allProducts), [q]);

  const update = (value: string) => {
    setQ(value);
    const next = value.trim()
      ? `?q=${encodeURIComponent(value.trim())}`
      : '';
    window.history.replaceState(null, '', window.location.pathname + next);
    setLastUrl(next);
  };

  const trimmed = q.trim();

  /**
   * Arabic agrees the counted noun with the number: one takes a singular, two
   * a dual, three to ten a plural, and eleven upward a singular again. English
   * only needs the one/many split.
   */
  const countLabel = (n: number) => {
    if (locale !== 'ar') {
      return `${n} ${n === 1 ? dict.search.result : dict.search.results}`;
    }
    if (n === 1) return dict.search.countOne;
    if (n === 2) return dict.search.countTwo;
    if (n >= 3 && n <= 10) return `${n} ${dict.search.countFew}`;
    return `${n} ${dict.search.results}`;
  };

  return (
    <>
      <div className="relative mt-6 max-w-xl">
        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-ink-400">
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => update(e.target.value)}
          placeholder={dict.search.placeholder}
          aria-label={dict.search.label}
          autoComplete="off"
          className="h-13 w-full rounded-sm border border-papyrus-300 bg-papyrus-50 ps-11 pe-11 text-base text-ink-900 transition-colors duration-200 placeholder:text-ink-400 hover:border-papyrus-400 focus:border-lapis-600"
        />
        {trimmed && (
          <button
            type="button"
            onClick={() => {
              update('');
              inputRef.current?.focus();
            }}
            aria-label={dict.search.clear}
            className="absolute inset-y-0 end-0 flex w-11 cursor-pointer items-center justify-center text-ink-500 transition-colors duration-200 hover:text-carnelian-600"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      <p className="mt-3 text-sm text-ink-500" aria-live="polite">
        {trimmed ? countLabel(hits.length) : dict.search.prompt}
      </p>

      {!trimmed && (
        <p className="mt-1 text-sm text-ink-400">{dict.search.hint}</p>
      )}

      {trimmed && hits.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-ink-700">
            {dict.search.none} “{trimmed}”
          </p>
          <p className="mt-2 text-sm text-ink-500">{dict.search.noneHint}</p>
          <Link
            href={`/${locale}/collections`}
            className="mt-6 inline-flex min-h-12 cursor-pointer items-center rounded-sm bg-lapis-800 px-6 font-semibold text-papyrus-50 transition-colors duration-200 hover:bg-lapis-900"
          >
            {dict.search.browseAll}
          </Link>
        </div>
      )}

      {hits.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
          {hits.map(({ product }, i) => (
            <ProductCard
              key={product.slug}
              product={product}
              locale={locale}
              dict={dict}
              priority={i < 4}
            />
          ))}
        </div>
      )}
    </>
  );
}
