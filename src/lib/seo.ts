import type { Metadata } from 'next';
import type { Locale } from '@/data/products';
import { locales } from './i18n';

export const SITE_URL = 'https://mla-kappa.vercel.app';

/**
 * Canonical plus the hreflang set for one page.
 *
 * Declared per page rather than once in the layout: a canonical has to name
 * the page itself, and an inherited one would point every product at the home
 * page. `path` is the route *without* its locale prefix — '' for the home
 * page, '/collections', '/products/scarab-blue'.
 *
 * x-default goes to English as the fallback for searchers whose language we
 * do not publish in.
 */
export function alternatesFor(locale: Locale, path = ''): Metadata['alternates'] {
  const languages = Object.fromEntries([
    ...locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
    ['x-default', `${SITE_URL}/en${path}`],
  ]);

  return { canonical: `${SITE_URL}/${locale}${path}`, languages };
}

/** og:locale wants the full tag, not the bare language code. */
export const ogLocale = (locale: Locale) =>
  locale === 'ar' ? 'ar_AE' : 'en_US';

export const openGraphFor = (
  locale: Locale,
  path = '',
): NonNullable<Metadata['openGraph']> => ({
  url: `${SITE_URL}/${locale}${path}`,
  locale: ogLocale(locale),
  alternateLocale: locales
    .filter((l) => l !== locale)
    .map((l) => ogLocale(l)),
});
