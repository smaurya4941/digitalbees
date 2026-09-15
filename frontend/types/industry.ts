import type { SeoBlock } from './seo';
import type { Hero, ProofPoint, TechnologySummary } from './content';
import type { PracticeSummary } from './practice';
import type { CaseStudySummary } from './case-study';

/** GET /api/v1/industries — one row. */
export interface IndustrySummary {
  id: number;
  slug: string;
  name: string;
  summary: string | null;
  icon: string | null;
  href: string;
}

/** GET /api/v1/industries/{slug} — the `industry` template contract. */
export interface IndustryDetail {
  id: number;
  slug: string;
  name: string;
  template: 'industry';
  href: string;
  hero: Hero;
  proof_points: ProofPoint[];
  practices: PracticeSummary[];
  technologies: TechnologySummary[];
  case_studies: CaseStudySummary[];
  seo: SeoBlock;
}
