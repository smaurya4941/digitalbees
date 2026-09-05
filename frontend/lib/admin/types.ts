/** Shapes returned by the authenticated admin API. */

export type Permission =
  | 'content.create'
  | 'content.update'
  | 'content.publish'
  | 'content.delete'
  | 'media.upload'
  | 'media.delete'
  | 'seo.update'
  | 'navigation.update'
  | 'inquiries.view'
  | 'inquiries.manage'
  | 'settings.manage'
  | 'users.manage'
  | 'roles.manage';

export type Role = 'admin' | 'staff';

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  department: string | null;
  status: 'active' | 'invited' | 'suspended';
  role: Role | null;
  permissions: Permission[];
}

export interface AdminPractice {
  id: number;
  name: string;
  slug: string;
  tagline: string | null;
  summary: string | null;
  icon: string | null;
  color_token: string | null;
  sort_order: number;
  status: ContentStatus;
  sub_services_count?: number;
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
  sort_order?: number;
  status?: ContentStatus;
}
