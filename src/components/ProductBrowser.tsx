'use client';

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { collections } from '@/data/collections';
import type { Locale, Product } from '@/data/products';
import type { Dictionary } from '@/lib/i18n';
import { formatMoney } from '@/lib/currency';
import { useShop } from '@/lib/shop-store';
import { ProductCard } from './ProductCard';

type Sort = 'featured' | 'priceAsc' | 'priceDesc' | 'nameAsc';

const SORTS: Sort[] = ['featured', 'priceAsc', 'priceDesc', 'nameAsc'];
const isSort = (v: string | null): v is Sort =>
  !!v && (SORTS as string[]).includes(v);

/** Back/forward are the only things that change the query behind our back. */
const subscribeToUrl = (onChange: () => void) => {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
};
const getUrlQuery = () => window.location.search;
const getServerUrlQuery = () => '';

/** Price bands in USD. Converted for display, so they move with the currency. */
const BANDS: { id: string; min: number; max: number }[] = [
  { id: 'under-25', min: 0, max: 25 },
  { id: '25-50', min: 25, max: 50 },
  { id: '50-100', min: 50, max: 100 },
  { id: 'over-100', min: 100, max: Infinity },
];

/**
 * Materials are keyed by their English name in the data, which does not belong
 * in a URL. Slugging is one-way, so the slug is matched back against the list
 * rather than parsed.
 */
const materialSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

type Filters = {
  sort: Sort;
  collection: string;
  material: string;
  band: string;
};

const PARAM = {
  sort: 'sort',
  collection: 'collection',
  material: 'material',
  band: 'price',
} as const;

export function ProductBrowser({
  products,
  locale,
  dict,
  initialSort = 'featured',
  showCollectionFilter = true,
}: {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
  initialSort?: Sort;
  showCollectionFilter?: boolean;
}) {
  const { currency } = useShop();

  const materials = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) seen.set(p.material.en, p.material[locale]);
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [products, locale]);

  // The query is read straight from the address bar rather than through
  // useSearchParams, which would mark this subtree dynamic and strip the whole
  // product grid out of the prerendered HTML — crawlers would see an empty
  // shop. The server snapshot is empty, so the grid renders unfiltered and the
  // client applies the URL's filters after hydration.
  const urlQuery = useSyncExternalStore(
    subscribeToUrl,
    getUrlQuery,
    getServerUrlQuery,
  );

  const defaults = useMemo<Filters>(
    () => ({
      sort: initialSort,
      collection: 'all',
      material: 'all',
      band: 'all',
    }),
    [initialSort],
  );

  const parse = useCallback(
    (query: string): Filters => {
      const q = new URLSearchParams(query);
      const sort = q.get(PARAM.sort);
      const collection = q.get(PARAM.collection);
      const material = q.get(PARAM.material);
      const band = q.get(PARAM.band);
      const matchedMaterial = materials.find(
        ([en]) => materialSlug(en) === material,
      );
      return {
        sort: isSort(sort) ? sort : defaults.sort,
        collection:
          collection && collections.some((c) => c.id === collection)
            ? collection
            : 'all',
        material: matchedMaterial ? matchedMaterial[0] : 'all',
        band: BANDS.some((b) => b.id === band) ? band! : 'all',
      };
    },
    [defaults, materials],
  );

  const [filters, setFilters] = useState<Filters>(defaults);
  const [lastQuery, setLastQuery] = useState('');
  if (urlQuery !== lastQuery) {
    setLastQuery(urlQuery);
    setFilters(parse(urlQuery));
  }

  /**
   * Every filter lives in the URL so a view can be linked, bookmarked and
   * stepped back through. Defaults are left out, so the unfiltered page keeps
   * exactly one address.
   */
  const apply = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);

    const q = new URLSearchParams();
    if (next.sort !== defaults.sort) q.set(PARAM.sort, next.sort);
    if (next.collection !== 'all') q.set(PARAM.collection, next.collection);
    if (next.material !== 'all')
      q.set(PARAM.material, materialSlug(next.material));
    if (next.band !== 'all') q.set(PARAM.band, next.band);

    const qs = q.toString();
    // Filtering is entirely client-side, so swap the URL without asking the
    // server for anything.
    window.history.replaceState(
      null,
      '',
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
    );
    setLastQuery(qs ? `?${qs}` : '');
  };

  const { sort, collection, material, band } = filters;

  const visible = useMemo(() => {
    let list = products;
    if (collection !== 'all') list = list.filter((p) => p.collection === collection);
    if (material !== 'all') list = list.filter((p) => p.material.en === material);
    if (band !== 'all') {
      const b = BANDS.find((x) => x.id === band);
      if (b) list = list.filter((p) => p.priceUsd >= b.min && p.priceUsd < b.max);
    }
    const sorted = [...list];
    switch (sort) {
      case 'priceAsc':
        sorted.sort((a, b) => a.priceUsd - b.priceUsd);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.priceUsd - a.priceUsd);
        break;
      case 'nameAsc':
        sorted.sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale));
        break;
      default:
        sorted.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) ||
            Number(b.compareAtUsd !== null) - Number(a.compareAtUsd !== null),
        );
    }
    return sorted;
  }, [products, collection, material, band, sort, locale]);

  const dirty = collection !== 'all' || material !== 'all' || band !== 'all';
  const clear = () => apply({ collection: 'all', material: 'all', band: 'all' });

  const fieldClass = 'basis-[calc(50%-0.375rem)] sm:basis-auto';
  const selectClass =
    'w-full min-h-11 cursor-pointer rounded-sm border border-papyrus-300 bg-papyrus-50 px-3 text-sm font-medium text-ink-800 transition-colors duration-200 hover:border-lapis-500 focus-visible:border-lapis-600';

  const bandLabel = (b: (typeof BANDS)[number]) => {
    if (b.max === Infinity)
      return `${dict.collection.over} ${formatMoney(b.min, currency, locale)}`;
    if (b.min === 0)
      return `${dict.collection.under} ${formatMoney(b.max, currency, locale)}`;
    return `${formatMoney(b.min, currency, locale)} – ${formatMoney(b.max, currency, locale)}`;
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 border-y border-papyrus-300 py-4">
        <span className="basis-full text-xs font-semibold tracking-[0.14em] text-ink-500 uppercase sm:basis-auto">
          {dict.collection.filters}
        </span>

        {showCollectionFilter && (
          <label className={fieldClass}>
            <span className="sr-only">{dict.collection.filterCollection}</span>
            <select
              value={collection}
              onChange={(e) => apply({ collection: e.target.value })}
              className={selectClass}
              aria-label={dict.collection.filterCollection}
            >
              <option value="all">
                {dict.collection.filterCollection}: {dict.collection.all}
              </option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name[locale]}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className={fieldClass}>
          <span className="sr-only">{dict.collection.filterMaterial}</span>
          <select
            value={material}
            onChange={(e) => apply({ material: e.target.value })}
            className={selectClass}
            aria-label={dict.collection.filterMaterial}
          >
            <option value="all">
              {dict.collection.filterMaterial}: {dict.collection.all}
            </option>
            {materials.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className={fieldClass}>
          <span className="sr-only">{dict.collection.filterPrice}</span>
          <select
            value={band}
            onChange={(e) => apply({ band: e.target.value })}
            className={selectClass}
            aria-label={dict.collection.filterPrice}
          >
            <option value="all">
              {dict.collection.filterPrice}: {dict.collection.all}
            </option>
            {BANDS.map((b) => (
              <option key={b.id} value={b.id}>
                {bandLabel(b)}
              </option>
            ))}
          </select>
        </label>

        <label className={`${fieldClass} sm:ms-auto`}>
          <span className="sr-only">{dict.collection.sortBy}</span>
          <select
            value={sort}
            onChange={(e) => apply({ sort: e.target.value as Sort })}
            className={selectClass}
            aria-label={dict.collection.sortBy}
          >
            <option value="featured">{dict.collection.sortFeatured}</option>
            <option value="priceAsc">{dict.collection.sortPriceAsc}</option>
            <option value="priceDesc">{dict.collection.sortPriceDesc}</option>
            <option value="nameAsc">{dict.collection.sortNameAsc}</option>
          </select>
        </label>

        {dirty && (
          <button
            type="button"
            onClick={clear}
            className="min-h-11 cursor-pointer rounded-sm px-3 text-sm font-semibold text-carnelian-600 underline underline-offset-4 transition-colors duration-200 hover:text-carnelian-700"
          >
            {dict.collection.clear}
          </button>
        )}
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-ink-500">
        {dict.collection.showing} {visible.length} {dict.collection.of}{' '}
        {products.length} {dict.collection.pieces}
      </p>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-ink-500">{dict.collection.none}</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((p, i) => (
            <ProductCard
              key={p.slug}
              product={p}
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
