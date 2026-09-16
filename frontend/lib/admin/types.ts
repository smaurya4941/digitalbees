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

/** A `whats_included` row on a sub-service (blueprint §22.4). */
export interface WhatsIncludedItem {
  title: string;
  description: string;
}

export interface AdminSubService {
  id: number;
  name: string;
  slug: string;
  summary: string | null;
  body: string | null;
  whats_included: WhatsIncludedItem[] | null;
  status: ContentStatus;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

/* -------------------------------------------------------------------------- */
/*  Practice capability columns — see PracticeDetailResource / PracticeSeeder */
/* -------------------------------------------------------------------------- */

export interface KeyStat {
  value: string;
  label: string;
}

export interface KeyCapability {
  id?: number;
  title: string;
  description: string;
  sort_order?: number;
}

export interface WorkflowStep {
  id?: number;
  step: number;
  title: string;
  description: string;
  sort_order?: number;
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

export interface AdminPractice {
  id: number;
  name: string;
  slug: string;
  tagline: string | null;
  summary: string | null;
  icon: string | null;
  color_token: string | null;
  featured_image: string | null;
  key_stats: KeyStat[] | null;
  capabilities: KeyCapability[] | null;
  workflows: WorkflowStep[] | null;
  framework_stack: FrameworkStackRow[] | null;
  agent_capabilities: string[] | null;
  technical_capabilities: TechnicalCapability[] | null;
  servicenow_fit: ServiceNowFit | null;
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
  key_stats?: KeyStat[];
  capabilities?: KeyCapability[];
  workflows?: WorkflowStep[];
  framework_stack?: FrameworkStackRow[];
  agent_capabilities?: string[];
  technical_capabilities?: TechnicalCapability[];
  servicenow_fit?: ServiceNowFit | null;
  sort_order?: number;
  status?: ContentStatus;
  sub_services?: Array<{
    id?: number;
    name: string;
    slug?: string;
    summary?: string | null;
    body?: string | null;
    whats_included?: WhatsIncludedItem[];
    status?: ContentStatus;
    sort_order?: number;
  }>;
}

/* -------------------------------------------------------------------------- */
/*  Testimonials                                                             */
/* -------------------------------------------------------------------------- */

/** Testimonial `status` is a simpler binary than the 3-state ContentStatus. */
export type TestimonialStatus = 'draft' | 'published';

export interface AdminTestimonial {
  id: number;
  quote: string;
  author_name: string | null;
  author_title: string | null;
  author_company: string | null;
  author_photo_media_id: number | null;
  related_type: string | null;
  related_id: number | null;
  status: TestimonialStatus;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface TestimonialInput {
  quote: string;
  author_name?: string | null;
  author_title?: string | null;
  author_company?: string | null;
  related_type?: string | null;
  related_id?: number | null;
  status?: TestimonialStatus;
  sort_order?: number;
}

/* -------------------------------------------------------------------------- */
/*  FAQs                                                                     */
/* -------------------------------------------------------------------------- */

/** FAQ `status` is a simpler binary than the 3-state ContentStatus. */
export type FaqStatus = 'draft' | 'published';

/** Morph-map key of the entity an FAQ is attached to, if any. */
export type FaqableType = 'practice' | 'sub_service';

export interface AdminFaq {
  id: number;
  question: string;
  answer: string;
  faqable_type: FaqableType | null;
  faqable_id: number | null;
  status: FaqStatus;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface FaqInput {
  question: string;
  answer: string;
  faqable_type?: FaqableType | null;
  faqable_id?: number | null;
  status?: FaqStatus;
  sort_order?: number;
}
