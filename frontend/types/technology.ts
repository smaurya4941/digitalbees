import type { SeoBlock } from './seo';
import type { Hero, ProofPoint, IndustrySummary, TechnologySummary } from './content';
import type { PracticeSummary } from './practice';
import type { CaseStudySummary } from './case-study';

export type { TechnologySummary };

/** GET /api/v1/technologies/{slug} — the `technology` template contract. */
export interface TechnologyDetail {
  id: number;
  slug: string;
  name: string;
  vendor_name: string | null;
  template: 'technology';
  href: string;
  hero: Hero;
  proof_points: ProofPoint[];
  practices: PracticeSummary[];
  industries: IndustrySummary[];
  case_studies: CaseStudySummary[];
  seo: SeoBlock;
}
