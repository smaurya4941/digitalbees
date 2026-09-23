'use client';

import { adminApi, type AdminPaginated } from './http';
import type { ContentStatus, TaxonomyListFilters } from './types';

/**
 * Admin client for the `resources` table. The admin "Blog" section works on
 * `resource_type = blog` rows; the other types remain supported by the API.
 */
export const RESOURCE_TYPES = ['blog', 'guide', 'webinar', 'research', 'news'] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export interface AdminResource {
  id: number;
  title: string;
  slug: string;
  resource_type: ResourceType;
  blog_category_id: number | null;
  category: { id: number; name: string; slug: string } | null;
  excerpt: string | null;
  body: string | null;
  cover_image: string | null;
  cover_image_alt: string | null;
  author_name: string | null;
  author_role: string | null;
  author_avatar: string | null;
  tags: string[];
  is_featured: boolean;
  reading_time_minutes: number | null;
  status: ContentStatus;
  published_at: string | null;
  public_url: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ResourceInput {
  title?: string;
  slug?: string;
  resource_type?: ResourceType;
  blog_category_id?: number | null;
  excerpt?: string | null;
  body?: string | null;
  cover_image?: string | null;
  cover_image_alt?: string | null;
  author_name?: string | null;
  author_role?: string | null;
  author_avatar?: string | null;
  tags?: string[];
  is_featured?: boolean;
  reading_time_minutes?: number | null;
  status?: ContentStatus;
  published_at?: string | null;
}

export type ResourceListFilters = TaxonomyListFilters & { type?: string; category?: string };

const KEY = ['admin', 'resources'] as const;

export const resourceQueryKeys = {
  all: KEY,
  list: (filters: ResourceListFilters) => [...KEY, 'list', filters] as const,
  detail: (slug: string) => [...KEY, slug] as const,
};

export function listResources(
  filters: ResourceListFilters,
  signal?: AbortSignal,
): Promise<AdminPaginated<AdminResource>> {
  return adminApi.getPage<AdminResource>('admin/resources', {
    signal,
    query: {
      q: filters.q || undefined,
      status: filters.status || undefined,
      type: filters.type || undefined,
      category: filters.category || undefined,
      page: filters.page,
      sort: filters.sort,
    },
  });
}

export function getResource(slug: string, signal?: AbortSignal): Promise<AdminResource> {
  return adminApi.get<AdminResource>(`admin/resources/${slug}`, signal);
}

export function createResource(input: ResourceInput): Promise<AdminResource> {
  return adminApi.post<AdminResource>('resources', input);
}

export function updateResource(slug: string, input: ResourceInput): Promise<AdminResource> {
  return adminApi.put<AdminResource>(`resources/${slug}`, input);
}

export function setResourceStatus(slug: string, status: ContentStatus): Promise<AdminResource> {
  return adminApi.put<AdminResource>(`resources/${slug}`, { status });
}

export function deleteResource(slug: string): Promise<{ deleted: boolean; slug: string }> {
  return adminApi.delete(`resources/${slug}`);
}

export interface BodyPreview {
  html: string;
  toc: { id: string; text: string; level: number }[];
  reading_time_minutes: number | null;
}

/** Renders a body through the same Markdown + sanitiser pipeline as the live site. */
export function previewBody(body: string): Promise<BodyPreview> {
  return adminApi.post<BodyPreview>('admin/blog/preview', { body });
}
