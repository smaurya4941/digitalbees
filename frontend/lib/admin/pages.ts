'use client';

import { adminApi, type AdminPaginated } from './http';
import type { ContentStatus } from './types';

export interface AdminPageListItem {
  id: number;
  url_path: string;
  title: string;
  status: ContentStatus;
  template: string | null;
  updated_at: string | null;
}

export interface AdminPageDetail {
  id: number;
  url_path: string;
  title: string;
  status: ContentStatus;
  template_key: string | null;
  sections: Record<string, unknown>;
}

export interface PageInput {
  title?: string;
  status?: ContentStatus;
  sections?: Record<string, unknown>;
}

const KEY = ['admin', 'pages'] as const;

export const pageQueryKeys = {
  all: KEY,
  list: (page: number) => [...KEY, 'list', page] as const,
  detail: (id: number) => [...KEY, 'detail', id] as const,
};

export function listPages(page: number, signal?: AbortSignal): Promise<AdminPaginated<AdminPageListItem>> {
  return adminApi.getPage<AdminPageListItem>('admin/pages', { signal, query: { page } });
}

export function getPage(id: number, signal?: AbortSignal): Promise<AdminPageDetail> {
  return adminApi.get<AdminPageDetail>(`admin/pages/${id}`, signal);
}

export function updatePage(id: number, input: PageInput): Promise<AdminPageDetail> {
  return adminApi.patch<AdminPageDetail>(`admin/pages/${id}`, input);
}
