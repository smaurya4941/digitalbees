/**
 * Cache-tag vocabulary shared by data fetchers and the revalidation webhook
 * (app/api/revalidate). The Laravel backend dispatches the same strings via
 * NotifyFrontendRevalidate, e.g. `['practices', 'practice:ai-bees']`.
 *
 * Every tag below must match a string the backend actually dispatches —
 * see each module's `*Service::flush()`. A mismatch means published content
 * silently never revalidates.
 */
export const cacheTags = {
  practices: 'practices',
  practice: (slug: string) => `practice:${slug}`,
  subService: (practiceSlug: string, slug: string) => `sub-service:${practiceSlug}:${slug}`,
  navigation: 'navigation',
  industries: 'industries',
  industry: (slug: string) => `industry:${slug}`,
  regions: 'regions',
  region: (slug: string) => `region:${slug}`,
  technologies: 'technologies',
  technology: (slug: string) => `technology:${slug}`,
  caseStudies: 'case-studies',
  caseStudy: (slug: string) => `case-study:${slug}`,
  careers: 'careers',
  career: (slug: string) => `career:${slug}`,
  /**
   * Insights and Resources share one table, and ResourceService::flush()
   * dispatches `resources`, `insights` and `resource:{slug}` together — so a
   * published row invalidates both hubs. The per-item tag is `resource:` for
   * insights too; there is no `insight:` tag.
   */
  resources: 'resources',
  insights: 'insights',
  resource: (slug: string) => `resource:${slug}`,
  locations: 'locations',
  location: (slug: string) => `location:${slug}`,
  /**
   * Generic CMS pages (curated combinatorial pages, and later the Company
   * sub-pages). Per-path tag matches PageAdminController's dispatch string
   * once admin write support lands for this module.
   */
  pages: 'pages',
  page: (path: string) => `page:${path}`,
  testimonials: 'testimonials',
  company: 'company',
} as const;
