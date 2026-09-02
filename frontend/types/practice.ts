import type { SeoBlock } from './seo';
import type {
  Hero,
  IndustrySummary,
  ProcessStep,
  ProofPoint,
  RegionSummary,
  TechnologySummary,
} from './content';

/** GET /api/v1/practices — one row. */
export interface PracticeSummary {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  summary: string | null;
  icon: string | null;
  color_token: string | null;
  href: string;
  sub_services_count?: number;
}

export interface SubService {
  id: number;
  slug: string;
  name: string;
  summary: string | null;
  body?: string | null;
  href: string | null;
}

/** GET /api/v1/practices/{slug} — the `practice` template contract. */
export interface PracticeDetail {
  id: number;
  slug: string;
  name: string;
  template: 'practice';
  href: string;
  hero: Hero;
  proof_points: ProofPoint[];
  how_we_work: ProcessStep[];
  services: SubService[];
  industries: IndustrySummary[];
  technologies: TechnologySummary[];
  regions: RegionSummary[];
  case_studies: unknown[];
  related_practices: PracticeSummary[];
  seo: SeoBlock;
}
