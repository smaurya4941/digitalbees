/**
 * A physical office. `LocationPublicResource` strips null fields with
 * `array_filter`, so optional keys may be *absent*, not just null.
 */
export interface LocationSummary {
  name: string;
  slug: string;
  address?: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
  /** Region name, present when the relation is loaded. */
  region?: string;
  href: string;
}

export type LocationDetail = LocationSummary;
