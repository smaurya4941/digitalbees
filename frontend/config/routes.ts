/**
 * Central URL builders. Never hand-concatenate public paths in components —
 * import from here so a taxonomy URL change is a one-line edit.
 */
export const routes = {
  home: () => '/',
  contact: () => '/contact-us',

  about: () => '/about',
  aboutLeadership: () => '/about/leadership',
  // Company sub-pages (blueprint §26.1) — `/about-us` 301-redirects to
  // `about()` or `companyOurStory()` (see next.config.ts's `redirects()`).
  companyOurStory: () => '/company/our-story',
  companyLeadership: () => '/company/leadership',
  companyPartnerships: () => '/company/partnerships',
  companyNewsroom: () => '/company/newsroom',
  companyEsg: () => '/company/esg',
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

  /** Legacy name for the blog hub — /insights/* permanently redirects to /blog/*. */
  insights: () => '/blog',
  insight: (slug: string) => `/blog/${slug}`,

  careers: () => '/careers',
  career: (slug: string) => `/careers/${slug}`,
  careerCandidateResources: () => '/careers/candidate-resources',
  careerDiversity: () => '/careers/diversity',

  locations: () => '/locations',
  location: (slug: string) => `/locations/${slug}`,

  services: () => '/services',
  servicePillar: (pillar: string) => `/services/${pillar}`,
  serviceCluster: (pillar: string, slug: string) => `/services/${pillar}/${slug}`,

  blog: () => '/blog',
  blogPost: (slug: string) => `/blog/${slug}`,
  blogCategory: (category: string) => `/blog/category/${category}`,
  blogTag: (tag: string) => `/blog?tag=${encodeURIComponent(tag)}`,

  privacy: () => '/privacy',
  terms: () => '/terms',
  cookies: () => '/cookies',
  cookiePolicy: () => '/cookies',
  sitemap: () => '/sitemap',
} as const;
