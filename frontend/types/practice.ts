import type { SeoBlock } from './seo';
import type { Cta } from './content';
import type {
  Hero,
  IndustrySummary,
  ProcessStep,
  ProofPoint,
  RegionSummary,
  TechnologySummary,
} from './content';
import type { CaseStudySummary } from './case-study';

export interface KeyCapability {
  title: string;
  description: string;
}

export interface FrameworkStackRow {
  category: string;
  tools: string[];
}

export interface TechnicalCapability {
  title: string;
  points: string[];
  proven_in: string[];
}

export interface ServiceNowFit {
  delivery: { label: string; items: string[] }[];
  cards: { title: string; description: string }[];
}

/** GET /api/v1/practices — one row. */
export interface PracticeSummary {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  summary: string | null;
  icon: string | null;
  color_token: string | null;
  featured_image: string | null;
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

export interface WhatsIncludedItem {
  title: string;
  description: string;
}

/** GET /api/v1/practices/{practice}/sub-services/{subService} — the `sub-service` template contract. */
export interface SubServiceDetail {
  id: number;
  slug: string;
  name: string;
  template: 'sub-service';
  summary: string | null;
  body?: string | null;
  href: string | null;
  practice: PracticeSummary | null;
  hero: Hero;
  proof_points: ProofPoint[];
  whats_included: WhatsIncludedItem[];
  case_study: CaseStudySummary | null;
  cta: Cta;
  seo: SeoBlock;
}

/** GET /api/v1/practices/{slug} — the `practice` template contract. */
export interface PracticeDetail {
  id: number;
  slug: string;
  name: string;
  template: 'practice';
  href: string;
  featured_image: string | null;
  hero: Hero;
  proof_points: ProofPoint[];
  how_we_work: ProcessStep[];
  services: SubService[];
  key_capabilities?: KeyCapability[];
  framework_stack?: FrameworkStackRow[];
  agent_capabilities?: string[];
  technical_capabilities?: TechnicalCapability[];
  servicenow_fit?: ServiceNowFit | null;
  industries: IndustrySummary[];
  technologies: TechnologySummary[];
  regions: RegionSummary[];
  case_studies: CaseStudySummary[];
  related_practices: PracticeSummary[];
  seo: SeoBlock;
}
