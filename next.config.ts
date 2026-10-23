import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.css': { loaders: ['@tailwindcss/turbopack'], as: '*.css' },
    },
  },
  async redirects() {
    return [
      { source: '/', destination: '/en', permanent: false },
      { source: '/collections', destination: '/en/collections', permanent: false },
      { source: '/story', destination: '/en/story', permanent: false },
      { source: '/shipping', destination: '/en/shipping', permanent: false },
      { source: '/cart', destination: '/en/cart', permanent: false },
    ];
  },
};

export default nextConfig;
