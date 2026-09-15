import type { SeoBlock } from './seo';
import type { Hero, IndustrySummary, ProcessStep, RegionSummary, TechnologySummary } from './content';
import type { PracticeSummary } from './practice';

export interface CaseStudyMetric {
  label: string;
  value: string;
}

/** Compact case-study shape used by grids and "related case studies" blocks. */
export interface CaseStudySummary {
  id: number;
  slug: string;
  title: string;
  client_name: string | null;
  summary: string | null;
  metrics: CaseStudyMetric[];
  published_at: string | null;
  href: string;
}

/**
 * GET /api/v1/case-studies/{slug} — the `case-study` template contract.
 * Mirrors the fixed structure the blueprint requires of every case study
 * (§25.1): challenge → approach → results → proof.
 */
export interface CaseStudyDetail {
  id: number;
  slug: string;
  title: string;
  template: 'case-study';
  href: string;
  hero: Hero;
  client: { name: string | null } | null;
  summary: string | null;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  metrics: CaseStudyMetric[];
  how_it_works: ProcessStep[];
  capabilities_used: string[];
  published_at: string | null;
  practices: PracticeSummary[];
  industries: IndustrySummary[];
  technologies: TechnologySummary[];
  regions: RegionSummary[];
  seo: SeoBlock;
}
