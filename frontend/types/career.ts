/**
 * Open roles. `JobPostingPublicResource` strips null fields with
 * `array_filter`, so optional keys may be *absent*, not just null.
 */
export interface JobLocation {
  name?: string;
  city?: string;
  country?: string;
}

export interface JobPostingSummary {
  title: string;
  slug: string;
  employment_type?: string;
  location?: JobLocation | null;
  posted_at?: string;
  closes_at?: string;
  href: string;
}

/** The same payload with `description` included (detail endpoint only). */
export interface JobPostingDetail extends JobPostingSummary {
  description?: string;
}
