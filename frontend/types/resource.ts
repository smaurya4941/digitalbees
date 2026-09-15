/**
 * Insights and Resources are the same table (`resources`); `resource_type`
 * decides which hub owns the row and therefore which URL it lives at
 * (IA §1: `blog` → /insights/{slug}, everything else → /resources/{slug}).
 *
 * `ResourcePublicResource` strips null fields with `array_filter`, so every
 * optional key here may be *absent*, not just null.
 */
export type ResourceType = 'blog' | 'guide' | 'webinar' | 'research' | 'news';

export interface ResourceSummary {
  title: string;
  slug: string;
  resource_type: ResourceType;
  excerpt?: string;
  reading_time_minutes?: number;
  published_at?: string;
  href: string;
}

/** The same payload with `body` included (detail endpoints only). */
export interface ResourceDetail extends ResourceSummary {
  body?: string;
}
