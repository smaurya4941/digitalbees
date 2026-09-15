import type { SeoBlock } from './seo';
import type { Hero, ProofPoint } from './content';
import type { PracticeSummary } from './practice';
import type { CaseStudySummary } from './case-study';

/** GET /api/v1/regions — one row. */
export interface RegionSummary {
  id: number;
  slug: string;
  name: string;
  iso_code: string | null;
  summary: string | null;
  href: string;
}

/** A physical office, as embedded in a region's detail payload. */
export interface LocationSummary {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
}

/** GET /api/v1/regions/{slug} — the `region` template contract. */
export interface RegionDetail {
  id: number;
  slug: string;
  name: string;
  iso_code: string | null;
  template: 'region';
  href: string;
  hero: Hero;
  proof_points: ProofPoint[];
  practices: PracticeSummary[];
  locations: LocationSummary[];
  case_studies: CaseStudySummary[];
  seo: SeoBlock;
}
