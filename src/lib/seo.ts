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

/**
 * og:locale is matched against Facebook's own locale list, not BCP-47. That
 * list carries one generic Arabic — ar_AR — and no ar_AE or ar_OM, so a
 * country-specific tag is simply discarded.
 */
export const ogLocale = (locale: Locale) =>
  locale === 'ar' ? 'ar_AR' : 'en_US';

/**
 * The brand card shown when a link is pasted into WhatsApp or Instagram.
 *
 * Dimensions are declared explicitly: WhatsApp decides whether to fetch an
 * image partly on what the tags promise, and a preview that renders as a bare
 * link looks like a dead one.
 */
export const OG_IMAGE = {
  url: `${SITE_URL}/brand/og-image.png`,
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: 'MLA — Ancient Treasures',
};

export const openGraphFor = (
  locale: Locale,
  path = '',
): NonNullable<Metadata['openGraph']> => ({
  // Next replaces the layout's openGraph rather than merging into it, so
  // anything every page needs has to be restated here.
  type: 'website',
  siteName: 'MLA',
  url: `${SITE_URL}/${locale}${path}`,
  locale: ogLocale(locale),
  alternateLocale: locales
    .filter((l) => l !== locale)
    .map((l) => ogLocale(l)),
  images: [OG_IMAGE],
});
