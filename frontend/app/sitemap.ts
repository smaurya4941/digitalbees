import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { routes } from '@/config/routes';
import { getPractice, getPractices } from '@/lib/api/practices';
import { getIndustries } from '@/lib/api/industries';
import { getRegions } from '@/lib/api/regions';
import { getTechnologies } from '@/lib/api/technologies';
import { getCaseStudies } from '@/lib/api/case-studies';
import { getInsights, getResources } from '@/lib/api/resources';
import { getCareers } from '@/lib/api/careers';
import { getLocations } from '@/lib/api/locations';
import { getPages } from '@/lib/api/pages';

export const revalidate = 3600;

/**
 * sitemap.xml.
 *
 * Built from the collections that currently have rendered routes. The backend
 * `GET /api/v1/sitemap` (SitemapController) is still a stub; when it lands it
 * becomes the single source here.
 *
 * `/search` is deliberately absent — it is `noindex` per IA §7.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, '');
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = (
    [
      { url: `${base}${routes.home()}`, changeFrequency: 'weekly', priority: 1 },
      { url: `${base}${routes.practices()}`, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${base}${routes.industries()}`, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${base}${routes.regions()}`, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${base}${routes.technologies()}`, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${base}${routes.caseStudies()}`, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${base}${routes.insights()}`, changeFrequency: 'daily', priority: 0.7 },
      { url: `${base}${routes.resources()}`, changeFrequency: 'weekly', priority: 0.7 },
      { url: `${base}${routes.careers()}`, changeFrequency: 'daily', priority: 0.7 },
      { url: `${base}${routes.locations()}`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${base}${routes.companyOurStory()}`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${base}${routes.companyLeadership()}`, changeFrequency: 'monthly', priority: 0.5 },
      { url: `${base}${routes.companyPartnerships()}`, changeFrequency: 'monthly', priority: 0.5 },
      { url: `${base}${routes.companyNewsroom()}`, changeFrequency: 'weekly', priority: 0.5 },
      { url: `${base}${routes.companyEsg()}`, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${base}${routes.contact()}`, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${base}/how-we-work`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${base}${routes.privacy()}`, changeFrequency: 'yearly', priority: 0.2 },
      { url: `${base}${routes.terms()}`, changeFrequency: 'yearly', priority: 0.2 },
    ] satisfies MetadataRoute.Sitemap
  ).map((entry) => ({ ...entry, lastModified: now }));

  // A failure in any one collection must not take the sitemap down — each
  // degrades to empty and the rest of the file still publishes.
  const [
    practices,
    industries,
    regions,
    technologies,
    caseStudies,
    insights,
    resources,
    careers,
    locations,
    industryPracticePages,
    regionPracticePages,
  ] = await Promise.all([
    getPractices().catch(() => []),
    getIndustries().catch(() => []),
    getRegions().catch(() => []),
    getTechnologies().catch(() => []),
    getCaseStudies().catch(() => []),
    getInsights(1000).catch(() => ({ items: [], meta: {} })),
    getResources(undefined, 1000).catch(() => ({ items: [], meta: {} })),
    getCareers().catch(() => []),
    getLocations().catch(() => []),
    getPages('industry-practice').catch(() => []),
    getPages('region-practice').catch(() => []),
  ]);

  // Sub-service slugs aren't on the practice summary — fetch each practice's
  // detail to enumerate them (only 7 practices, so 7 extra requests).
  const practiceDetails = await Promise.all(practices.map((p) => getPractice(p.slug).catch(() => null)));
  const subServiceEntries = practiceDetails.flatMap((practice) =>
    practice ? practice.services.map((s) => ({ url: `${base}${routes.subService(practice.slug, s.slug)}` })) : [],
  );

  const collectionEntries: MetadataRoute.Sitemap = [
    ...practices.map((p) => ({ url: `${base}${routes.practice(p.slug)}` })),
    ...subServiceEntries,
    ...industries.map((i) => ({ url: `${base}${routes.industry(i.slug)}` })),
    ...regions.map((r) => ({ url: `${base}${routes.region(r.slug)}` })),
    ...technologies.map((t) => ({ url: `${base}${routes.technology(t.slug)}` })),
    ...caseStudies.map((c) => ({ url: `${base}${routes.caseStudy(c.slug)}` })),
    ...insights.items.map((i) => ({ url: `${base}${routes.insight(i.slug)}` })),
    ...resources.items.map((r) => ({ url: `${base}${routes.resource(r.slug)}` })),
    ...careers.map((c) => ({ url: `${base}${routes.career(c.slug)}` })),
    ...locations.map((l) => ({ url: `${base}${routes.location(l.slug)}` })),
    // Curated combinatorial pages only — never generated speculatively.
    ...industryPracticePages.map((p) => ({ url: `${base}${p.url_path}` })),
    ...regionPracticePages.map((p) => ({ url: `${base}${p.url_path}` })),
  ].map((entry) => ({
    ...entry,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...collectionEntries];
}
