'use client';

import { adminApi, type AdminPaginated } from './http';
import type {
  AdminPractice,
  ContentStatus,
  PracticeInput,
  PracticeRelationOptions,
  TaxonomyListFilters,
  TrashedPractice,
} from './types';

const KEY = ['admin', 'practices'] as const;

export const practiceQueryKeys = {
  all: KEY,
  list: (filters: TaxonomyListFilters) => [...KEY, 'list', filters] as const,
  detail: (slug: string) => [...KEY, slug] as const,
  trash: [...KEY, 'trash'] as const,
  relationOptions: [...KEY, 'relation-options'] as const,
};

export function listPractices(
  filters: TaxonomyListFilters,
  signal?: AbortSignal,
): Promise<AdminPaginated<AdminPractice>> {
  return adminApi.getPage<AdminPractice>('admin/practices', {
    signal,
    query: {
      q: filters.q || undefined,
      status: filters.status || undefined,
      page: filters.page,
      sort: filters.sort,
    },
  });
}

export function getPractice(slug: string, signal?: AbortSignal): Promise<AdminPractice> {
  return adminApi.get<AdminPractice>(`admin/practices/${slug}`, signal);
}

export function createPractice(input: PracticeInput): Promise<AdminPractice> {
  return adminApi.post<AdminPractice>('practices', input);
}

export function updatePractice(slug: string, input: Partial<PracticeInput>): Promise<AdminPractice> {
  return adminApi.put<AdminPractice>(`practices/${slug}`, input);
}

export function setPracticeStatus(slug: string, status: ContentStatus): Promise<AdminPractice> {
  return adminApi.put<AdminPractice>(`practices/${slug}`, { status });
}

export function deletePractice(slug: string): Promise<{ deleted: boolean; slug: string }> {
  return adminApi.delete(`practices/${slug}`);
}

/** Soft-deleted practices (admin only). */
export function listTrashedPractices(signal?: AbortSignal): Promise<TrashedPractice[]> {
  return adminApi.get<TrashedPractice[]>('admin/practices/trash', signal);
}

export function restorePractice(slug: string): Promise<AdminPractice> {
  return adminApi.post<AdminPractice>(`practices/${slug}/restore`, {});
}

/** Every industry, technology and region, for the practice relation pickers. */
export function getPracticeRelationOptions(signal?: AbortSignal): Promise<PracticeRelationOptions> {
  return adminApi.get<PracticeRelationOptions>('admin/practices/relation-options', signal);
}
