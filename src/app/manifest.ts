import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: 'Ledger Businesses',
    short_name: 'Ledger',
    description: 'Premium editorial coverage for business decision-makers.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f0e7dd',
    theme_color: '#9fe870',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    categories: ['business', 'news', 'finance', 'technology'],
    id: siteUrl,
  };
}
