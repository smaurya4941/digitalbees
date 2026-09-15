import type { SeoBlock } from './seo';
import type { CaseStudySummary } from './case-study';
import type { IndustrySummary } from './industry';
import type { PracticeSummary } from './practice';
import type { RegionSummary } from './region';

/**
 * A generic page-section content block, keyed by `section_key`
 * (e.g. `hero`, `why_it_matters`) — shape varies by key, so callers narrow
 * with the specific shape they expect.
 */
export type PageSectionContent = Record<string, unknown>;

export type ResolvedEntity = PracticeSummary | IndustrySummary | RegionSummary;

/**
 * GET /api/v1/pages/resolve?path=... — the generic page-resolution contract.
 * Backs both curated combinatorial pages (industry-practice, region-practice)
 * and simple CMS pages (e.g. the Company sub-pages) that don't warrant a
 * dedicated backend endpoint.
 */
export interface ResolvedPage {
  id: number;
  url_path: string;
  title: string | null;
  template_key: string | null;
  primary_entity: ResolvedEntity | null;
  secondary_entity: ResolvedEntity | null;
  sections: Record<string, PageSectionContent>;
  case_studies: CaseStudySummary[];
  seo: SeoBlock;
}

/** GET /api/v1/pages — lightweight listing used by the sitemap. */
export interface PageListItem {
  id: number;
  url_path: string;
  template_key: string | null;
  updated_at: string | null;
}
