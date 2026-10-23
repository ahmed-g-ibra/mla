import type { MetadataRoute } from 'next';
import { collections } from '@/data/collections';
import { products } from '@/data/products';
import { locales } from '@/lib/i18n';
import { SITE_URL } from '@/lib/seo';

/** Every public route, without its locale prefix. */
const paths: { path: string; priority: number }[] = [
  { path: '', priority: 1 },
  { path: '/collections', priority: 0.9 },
  ...collections.map((c) => ({ path: `/collections/${c.id}`, priority: 0.8 })),
  ...products.map((p) => ({ path: `/products/${p.slug}`, priority: 0.7 })),
  { path: '/story', priority: 0.5 },
  { path: '/shipping', priority: 0.5 },
  { path: '/faq', priority: 0.6 },
  { path: '/legal/returns', priority: 0.4 },
  { path: '/legal/terms', priority: 0.3 },
  { path: '/legal/privacy', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Each locale gets its own entry, and every entry names its translations so
  // crawlers pair /en and /ar instead of reading them as duplicates.
  return paths.flatMap(({ path, priority }) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
        ),
      },
    })),
  );
}
