/**
 * Blog posts and Resources are the same table (`resources`); `resource_type`
 * decides which hub owns the row and therefore which URL it lives at
 * (`blog` → /blog/{slug}, everything else → /resources/{slug}).
 *
 * `ResourcePublicResource` strips null fields with `array_filter`, so every
 * optional key here may be *absent*, not just null.
 */
import type { SeoBlock } from './seo';

export type ResourceType = 'blog' | 'guide' | 'webinar' | 'research' | 'news';

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  href: string;
  /** Present on GET /blog/categories only. */
  post_count?: number;
}

export interface PostAuthor {
  name: string;
  role?: string;
  avatar?: string;
}

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface ResourceSummary {
  id?: number;
  title: string;
  slug: string;
  resource_type: ResourceType;
  excerpt?: string;
  reading_time_minutes?: number;
  published_at?: string;
  updated_at?: string;
  href: string;
  cover_image?: string;
  cover_image_alt?: string;
  is_featured?: boolean;
  tags?: string[];
  category?: BlogCategory;
  author?: PostAuthor;
}

/** Detail endpoints add the sanitised body HTML, its outline and related posts. */
export interface ResourceDetail extends ResourceSummary {
  /** Server-rendered, allowlist-sanitised HTML. */
  body?: string;
  toc?: TocEntry[];
  related?: ResourceSummary[];
  seo?: SeoBlock;
}

export type BlogPost = ResourceSummary;
export type BlogPostDetail = ResourceDetail;
