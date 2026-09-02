/**
 * Cache-tag vocabulary shared by data fetchers and the revalidation webhook
 * (app/api/revalidate). The Laravel backend dispatches the same strings via
 * NotifyFrontendRevalidate, e.g. `['practices', 'practice:ai-bees']`.
 */
export const cacheTags = {
  practices: 'practices',
  practice: (slug: string) => `practice:${slug}`,
  navigation: 'navigation',
  industries: 'industries',
  industry: (slug: string) => `industry:${slug}`,
  regions: 'regions',
  region: (slug: string) => `region:${slug}`,
  technologies: 'technologies',
  technology: (slug: string) => `technology:${slug}`,
} as const;
