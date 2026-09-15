/** GET /api/v1/company/leadership — one row. */
export interface TeamMember {
  id: number;
  name: string;
  title: string | null;
  bio: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
}

/** GET /api/v1/company/partnerships — one row. */
export interface Partner {
  id: number;
  name: string;
  logo_url: string | null;
  partner_type: 'technology' | 'alliance' | 'certification';
  technology: { slug: string; name: string } | null;
  url: string | null;
}

/** GET /api/v1/company/our-story — one row. */
export interface CompanyMilestone {
  id: number;
  year: number;
  title: string | null;
  description: string | null;
}
