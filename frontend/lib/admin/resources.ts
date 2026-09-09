'use client';

import { adminApi, type AdminPaginated } from './http';
import type { ContentStatus, TaxonomyListFilters } from './types';

export const RESOURCE_TYPES = ['blog', 'guide', 'webinar', 'research', 'news'] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export interface AdminResource {
  id: number;
  title: string;
  slug: string;
  resource_type: ResourceType;
  excerpt: string | null;
  body: string | null;
  reading_time_minutes: number | null;
  status: ContentStatus;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ResourceInput {
  title?: string;
  slug?: string;
  resource_type?: ResourceType;
  excerpt?: string | null;
  body?: string | null;
  reading_time_minutes?: number | null;
  status?: ContentStatus;
}

export type ResourceListFilters = TaxonomyListFilters & { type?: string };

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
