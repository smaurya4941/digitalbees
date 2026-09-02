/**
 * Shared shapes for cross-entity references. Every "summary" resource the API
 * returns for related-content blocks conforms to {@link EntitySummary}.
 */
import type { Status } from './common';

export interface EntitySummary {
  id: number;
  slug: string;
  name: string;
  summary: string | null;
  href: string;
}

export interface IndustrySummary extends EntitySummary {
  icon: string | null;
}

export interface TechnologySummary extends EntitySummary {
  vendor_name: string | null;
}

export interface RegionSummary extends EntitySummary {
  iso_code: string | null;
}

export interface Cta {
  label: string;
  url: string;
}

export interface Hero {
  eyebrow: string;
  title: string;
  description: string | null;
  cta: Cta;
  secondary_cta?: Cta | null;
}

export interface ProofPoint {
  value: number | string;
  label: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export type { Status };
