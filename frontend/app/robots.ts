import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

/**
 * IA §7: allow everything except search, the API surface and draft-mode URLs.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin', '/search'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
