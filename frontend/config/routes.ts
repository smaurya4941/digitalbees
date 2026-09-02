/**
 * Central URL builders. Never hand-concatenate public paths in components —
 * import from here so a taxonomy URL change is a one-line edit.
 */
export const routes = {
  home: () => '/',
  about: () => '/about',
  contact: () => '/contact',
  search: (q?: string) => (q ? `/search?q=${encodeURIComponent(q)}` : '/search'),

  practices: () => '/practices',
  practice: (slug: string) => `/practices/${slug}`,
  subService: (practice: string, service: string) => `/practices/${practice}/${service}`,

  industries: () => '/industries',
  industry: (slug: string) => `/industries/${slug}`,
  industryPractice: (industry: string, practice: string) => `/industries/${industry}/${practice}`,

  regions: () => '/regions',
  region: (slug: string) => `/regions/${slug}`,
  regionPractice: (region: string, practice: string) => `/regions/${region}/${practice}`,

  technologies: () => '/technologies',
  technology: (slug: string) => `/technologies/${slug}`,

  caseStudies: () => '/case-studies',
  caseStudy: (slug: string) => `/case-studies/${slug}`,

  resources: () => '/resources',
  resource: (slug: string) => `/resources/${slug}`,

  insights: () => '/insights',
  insight: (slug: string) => `/insights/${slug}`,

  careers: () => '/careers',
  career: (slug: string) => `/careers/${slug}`,

  locations: () => '/locations',
  location: (slug: string) => `/locations/${slug}`,

  privacy: () => '/privacy',
  terms: () => '/terms',
} as const;
