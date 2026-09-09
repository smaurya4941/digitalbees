'use client';

import { adminApi, type AdminPaginated } from './http';

export interface AdminRedirect {
  id: number;
  from_path: string;
  to_path: string;
  status_code: number;
  is_active: boolean;
  updated_at: string | null;
}

export interface RedirectInput {
  from_path?: string;
  to_path?: string;
  status_code?: number;
  is_active?: boolean;
}

const KEY = ['admin', 'redirects'] as const;

export const redirectQueryKeys = {
  all: KEY,
  list: (filters: { q?: string; page?: number }) => [...KEY, 'list', filters] as const,
};

export function listRedirects(
  filters: { q?: string; page?: number },
  signal?: AbortSignal,
): Promise<AdminPaginated<AdminRedirect>> {
  return adminApi.getPage<AdminRedirect>('admin/redirects', {
    signal,
    query: { q: filters.q || undefined, page: filters.page },
  });
}

export function createRedirect(input: RedirectInput): Promise<AdminRedirect> {
  return adminApi.post<AdminRedirect>('admin/redirects', input);
}

export function updateRedirect(id: number, input: RedirectInput): Promise<AdminRedirect> {
  return adminApi.patch<AdminRedirect>(`admin/redirects/${id}`, input);
}

export function deleteRedirect(id: number): Promise<{ deleted: boolean; id: number }> {
  return adminApi.delete(`admin/redirects/${id}`);
}
