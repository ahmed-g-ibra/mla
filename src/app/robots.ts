import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/en/cart', '/ar/cart'] },
    sitemap: 'https://mla-kappa.vercel.app/sitemap.xml',
  };
}
