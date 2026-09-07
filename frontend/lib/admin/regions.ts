'use client';

import { adminApi, type AdminPaginated } from './http';
import type { ContentStatus, TaxonomyListFilters } from './types';

const KEY = ['admin', 'regions'] as const;

export const regionQueryKeys = {
  all: KEY,
  list: (filters: TaxonomyListFilters) => [...KEY, 'list', filters] as const,
  detail: (slug: string) => [...KEY, slug] as const,
};

export type AdminRegion = {
  id: number;
  name: string;
  slug: string;
  summary: string | null;
  iso_code: string | null;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type RegionInput = {
  name: string;
  slug: string;
  summary: string | null;
  iso_code: string | null;
  status?: ContentStatus;
  sort_order?: number;
};

export function listRegions(
  filters: TaxonomyListFilters,
  signal?: AbortSignal,
): Promise<AdminPaginated<AdminRegion>> {
  return adminApi.getPage<AdminRegion>('admin/regions', {
    signal,
    query: {
      q: filters.q || undefined,
      status: filters.status || undefined,
      page: filters.page,
      sort: filters.sort,
    },
  });
}

export function getRegion(slug: string, signal?: AbortSignal): Promise<AdminRegion> {
  return adminApi.get<AdminRegion>(`admin/regions/${slug}`, signal);
}

export function createRegion(input: RegionInput): Promise<AdminRegion> {
  return adminApi.post<AdminRegion>('regions', input);
}

export function updateRegion(slug: string, input: Partial<RegionInput>): Promise<AdminRegion> {
  return adminApi.put<AdminRegion>(`regions/${slug}`, input);
}

export function setRegionStatus(slug: string, status: ContentStatus): Promise<AdminRegion> {
  return adminApi.put<AdminRegion>(`admin/content/regions/${slug}/status`, { status });
}

export function deleteRegion(slug: string): Promise<{ deleted: boolean; slug: string }> {
  return adminApi.delete(`regions/${slug}`);
}
