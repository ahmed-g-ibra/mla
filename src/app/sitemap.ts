import type { MetadataRoute } from 'next';
import { collections } from '@/data/collections';
import { products } from '@/data/products';
import { locales } from '@/lib/i18n';

const BASE = 'https://mla-antiquities.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = locales.flatMap((locale) => [
    { url: `${BASE}/${locale}`, priority: 1 },
    { url: `${BASE}/${locale}/collections`, priority: 0.9 },
    { url: `${BASE}/${locale}/story`, priority: 0.5 },
    { url: `${BASE}/${locale}/shipping`, priority: 0.5 },
    ...collections.map((c) => ({
      url: `${BASE}/${locale}/collections/${c.id}`,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${BASE}/${locale}/products/${p.slug}`,
      priority: 0.7,
    })),
  ]);

  return pages.map((p) => ({ ...p, lastModified: now, changeFrequency: 'weekly' }));
}
