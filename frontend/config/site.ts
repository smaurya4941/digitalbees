import { clientEnv } from './environment';

/**
 * Static site-wide facts. Content that editors change lives in the CMS and is
 * fetched from the API — this is only what the app itself needs to boot.
 */
export const siteConfig = {
  name: 'The Digital Bees',
  legalName: 'The Digital Bees Corp',
  tagline: 'Talent + Technology from the same partner.',
  description:
    'The Digital Bees is a high-end B2B enterprise services partner for technology, digital transformation, AI, quality engineering, ServiceNow, marketing and energy.',
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
  ogImage: '/opengraph-image',
  locale: 'en_US',
  contact: {
    email: 'contact@digitalbees.in',
    phone: '+91 836 879 0581',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/teambees',
    x: 'https://x.com/teambees',
  },
  /** The seven practices — canonical slugs must match the backend `practices.slug`. */
  practices: [
    'talent-bees',
    'digital-bees',
    'ai-bees',
    'marketing-bees',
    'quality-bees',
    'servicenow-bees',
    'energy-bees',
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;
