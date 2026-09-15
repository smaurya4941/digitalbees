import { clientEnv } from './environment';

/**
 * Static site-wide facts. Content that editors change lives in the CMS and is
 * fetched from the API (`lib/api/settings.ts`) — this is only what the app
 * itself needs to boot, and the fallback used when the settings call fails.
 *
 * Values here must stay in sync with `backend/database/seeders/SettingSeeder.php`,
 * which is the runtime source of truth once the database is seeded.
 */
export const siteConfig = {
  name: 'TeamBees',
  legalName: 'TeamBees Corp',
  tagline: 'Talent and technology, from the same partner.',
  description:
    'TeamBees Corp is the global talent-and-technology partner that combines on-demand staffing with full delivery capability across Digital Engineering, AI, Quality Engineering, ServiceNow, and Energy Trading platforms.',
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
  ogImage: '/opengraph-image',
  locale: 'en_US',
  contact: {
    email: 'contact@teambees.com',
    phone: '+1 (800) 886 9600',
    /**
     * Deliberately not a single street address — per the IA, offices are
     * modelled as `Location` records surfaced at `/locations`, and the contact
     * page leads with direct-contact paths rather than a static address block.
     */
    presence: 'Global delivery · offices across 6 regions',
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
  /** The six regions — canonical slugs must match the backend `regions.slug`. */
  regions: ['usa', 'uk', 'europe', 'canada', 'australia', 'uae'] as const,
} as const;

export type SiteConfig = typeof siteConfig;
