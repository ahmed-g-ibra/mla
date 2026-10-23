import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: [
        '/en/cart',
        '/ar/cart',
        '/en/search',
        '/ar/search',
        '/en/order-sent',
        '/ar/order-sent',
        '/en/order/',
        '/ar/order/',
        '/admin',
        '/api/',
      ] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
