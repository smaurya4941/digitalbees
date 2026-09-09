/** Shapes returned by the authenticated admin API. */

export type Permission =
  | 'content.create'
  | 'content.update'
  | 'content.publish'
  | 'content.delete'
  | 'content.review'
  | 'content.approve'
  | 'media.upload'
  | 'media.delete'
  | 'seo.update'
  | 'navigation.update'
  | 'inquiries.view'
  | 'inquiries.manage'
  | 'settings.manage'
  | 'users.manage'
  | 'roles.manage'
  | 'audit.view';

export type Role = string;

export type ContentStatus = 'draft' | 'published' | 'archived';

/** Query params accepted by the paginated back-office list endpoints. */
export interface TaxonomyListFilters {
  q?: string;
  status?: string;
  page?: number;
  sort?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  department: string | null;
  status: 'active' | 'invited' | 'suspended';
  role: Role | null;
  permissions: Permission[];
}

export interface AdminSubService {
  id: number;
  name: string;
  slug: string;
  summary: string | null;
  body: string | null;
  status: ContentStatus;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminPractice {
  id: number;
  name: string;
  slug: string;
  tagline: string | null;
  summary: string | null;
  icon: string | null;
  color_token: string | null;
  featured_image: string | null;
  sort_order: number;
  status: ContentStatus;
  sub_services_count?: number;
  sub_services?: AdminSubService[];
  href: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface PracticeInput {
  name: string;
  slug?: string;
  tagline?: string | null;
  summary?: string | null;
  icon?: string | null;
  color_token?: string | null;
  featured_image?: string | null;
  sort_order?: number;
  status?: ContentStatus;
  sub_services?: Array<{
    id?: number;
    name: string;
    slug?: string;
    summary?: string | null;
    status?: ContentStatus;
    sort_order?: number;
  }>;
}
