import { clientEnv } from './environment';

/**
 * Static site-wide facts. Content that editors change lives in the CMS and is
 * fetched from the API — this is only what the app itself needs to boot.
 */
export const siteConfig = {
  name: 'TeamBees',
  legalName: 'TeamBees Corp',
  tagline: 'Talent + Technology from the same partner.',
  description:
    'TeamBees is a high-end B2B enterprise services partner for technology, digital transformation, AI, quality engineering, ServiceNow, marketing and energy.',
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
  ogImage: '/opengraph-image',
  locale: 'en_US',
  contact: {
    email: 'contact@teambees.corp',
    phone: '+1 (800) 886 9600',
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
