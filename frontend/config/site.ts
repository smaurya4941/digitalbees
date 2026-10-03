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
    email: 'info@teambeescorp.com',
    phone: '+1 (800) 886 9600',
    /**
     * Deliberately not a single street address — per the IA, offices are
     * modelled as `Location` records surfaced at `/locations`, and the contact
     * page leads with direct-contact paths rather than a static address block.
     */
    presence: 'Delivering from India · USA · Singapore · UAE',
  },
  /**
   * Headline figures from TeamBees' profile decks. Runtime source of truth is
   * the `company.*` settings (admin-editable); read them through
   * `companyFacts()` in `lib/api/settings.ts`, never directly from here.
   */
  company: {
    established: '2021',
    markets: ['India', 'USA', 'Singapore', 'UAE'],
    shortlistTurnaround: '2 business days',
    domainExperts: '50+',
    enterpriseCustomers: '20+',
  },
  /**
   * Offices, mirroring `LocationSeeder`. Runtime source of truth is the
   * `locations` API; this is only the fallback when it is unreachable.
   */
  offices: [
    {
      name: 'TeamBees Gurugram',
      slug: 'gurugram',
      city: 'Gurugram',
      country: 'India',
      region: 'India',
      region_code: 'IN',
      address: '337-338, Block-B3, Spaze i-Tech Park, Sector 49, Gurugram, Haryana 122018',
      href: '/locations/gurugram',
    },
    {
      name: 'TeamBees Chicago',
      slug: 'chicago',
      city: 'Chicago',
      country: 'United States',
      region: 'USA',
      region_code: 'US',
      address: '200 E 75th Street, Chicago, IL 60619',
      href: '/locations/chicago',
    },
    {
      name: 'TeamBees Singapore',
      slug: 'singapore',
      city: 'Singapore',
      country: 'Singapore',
      region: 'Singapore',
      region_code: 'SG',
      href: '/locations/singapore',
    },
    {
      name: 'TeamBees Dubai',
      slug: 'dubai',
      city: 'Dubai',
      country: 'United Arab Emirates',
      region: 'UAE',
      region_code: 'AE',
      href: '/locations/dubai',
    },
  ],
  social: {
    linkedin: 'https://www.linkedin.com/company/teambees-corp/',
    instagram: 'https://www.instagram.com/teambeescorpofficial/',
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
