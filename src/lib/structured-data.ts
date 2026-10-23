import { collectionById, collections } from '@/data/collections';
import { faq } from '@/content/faq';
import type { Locale, Product } from '@/data/products';
import { convert, currencyByCode, defaultCurrency } from './currency';
import { getDictionary } from './i18n';
import { SITE_URL } from './seo';
import { contactIsPlaceholder, storeConfig } from './store-config';

const ORG_ID = `${SITE_URL}/#organization`;

const abs = (locale: Locale, path = '') => `${SITE_URL}/${locale}${path}`;

/** The reference shown on the product page; the two must not drift apart. */
export const skuFor = (p: Product) => `MLA-${p.slug.slice(0, 8).toUpperCase()}`;

/**
 * Prices are quoted in AED because that is what the prerendered HTML shows —
 * the cart's server snapshot uses the default currency, and structured data
 * that disagrees with the visible price gets flagged.
 */
const priceIn = (usd: number) => {
  const currency = currencyByCode(defaultCurrency);
  return {
    price: convert(usd, currency).toFixed(currency.decimals),
    priceCurrency: currency.code,
  };
};

const GCC = ['AE', 'SA', 'QA', 'OM', 'BH', 'KW'];

export function organizationLd(locale: Locale) {
  const dict = getDictionary(locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': ORG_ID,
    name: dict.brand,
    alternateName: dict.brandLine,
    url: abs(locale),
    logo: `${SITE_URL}/brand/logo.png`,
    image: `${SITE_URL}/brand/logo.png`,
    description: dict.home.heroBody,
    inLanguage: locale,
    areaServed: GCC.map((c) => ({ '@type': 'Country', identifier: c })),
    currenciesAccepted: 'AED, SAR, QAR, OMR, BHD, KWD, USD',
    ...(contactIsPlaceholder
      ? {}
      : {
          sameAs: [`https://instagram.com/${storeConfig.instagram}`],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: `+${storeConfig.whatsappNumber}`,
            email: storeConfig.email,
            availableLanguage: ['en', 'ar'],
          },
        }),
  };
}

export function faqLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: faq.map((entry) => ({
      '@type': 'Question',
      name: entry.q[locale],
      acceptedAnswer: { '@type': 'Answer', text: entry.a[locale] },
    })),
  };
}

export function breadcrumbLd(
  locale: Locale,
  trail: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name,
      item: abs(locale, step.path),
    })),
  };
}

export function productLd(locale: Locale, p: Product) {
  const collection = collectionById(p.collection);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name[locale],
    description: p.description[locale],
    image: p.images.map((i) => `${SITE_URL}${i}`),
    sku: skuFor(p),
    material: p.material[locale],
    category: collection?.name[locale],
    inLanguage: locale,
    height: {
      '@type': 'QuantitativeValue',
      value: p.heightCm,
      unitCode: 'CMT',
    },
    brand: { '@type': 'Brand', name: 'MLA' },
    offers: {
      '@type': 'Offer',
      url: abs(locale, `/products/${p.slug}`),
      ...priceIn(p.priceUsd),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': ORG_ID },
    },
  };
}

export function itemListLd(locale: Locale, items: Product[], name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(locale, `/products/${p.slug}`),
      name: p.name[locale],
    })),
  };
}

export function collectionsIndexLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: getDictionary(locale).collection.allTitle,
    itemListElement: collections.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(locale, `/collections/${c.id}`),
      name: c.name[locale],
    })),
  };
}
