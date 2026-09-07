'use client';

import { adminApi, type AdminPaginated } from './http';

export interface AdminMedia {
  id: number;
  name: string;
  alt_text: string | null;
  folder: string | null;
  file_name: string;
  mime_type: string;
  size: number;
  width: number | null;
  height: number | null;
  url: string;
  uploaded_by: number | null;
  uploader_name?: string | null;
  created_at: string;
}

export interface MediaUsage {
  type: string;
  label: string;
}

export type MediaDetail = AdminMedia & { usages: MediaUsage[] };

export type MediaPage = AdminPaginated<AdminMedia> & { meta: { folders: string[] } };

export interface MediaFilters {
  q?: string;
  folder?: string | null;
  page?: number;
}

const KEY = ['admin', 'media'] as const;

export const mediaQueryKeys = {
  all: KEY,
  list: (filters: MediaFilters) => [...KEY, 'list', filters] as const,
  detail: (id: number) => [...KEY, 'detail', id] as const,
};

export function listMedia(filters: MediaFilters, signal?: AbortSignal): Promise<MediaPage> {
  const query: Record<string, string | number | undefined> = {
    q: filters.q || undefined,
    page: filters.page,
  };
  // `folder=''` means "no folder"; undefined means "any".
  if (filters.folder !== undefined && filters.folder !== null) query.folder = filters.folder;

  return adminApi.getPage<AdminMedia>('admin/media', { signal, query }) as Promise<MediaPage>;
}

export function getMediaDetail(id: number, signal?: AbortSignal): Promise<MediaDetail> {
  return adminApi.get<MediaDetail>(`admin/media/${id}`, signal);
}

export function uploadMedia(file: File, folder?: string): Promise<AdminMedia> {
  const form = new FormData();
  form.append('file', file);
  if (folder) form.append('folder', folder);
  return adminApi.post<AdminMedia>('admin/media', form);
}

export function updateMedia(
  id: number,
  input: { name?: string; alt_text?: string | null; folder?: string | null },
): Promise<AdminMedia> {
  return adminApi.patch<AdminMedia>(`admin/media/${id}`, input);
}

export function deleteMedia(id: number, force = false): Promise<{ deleted: boolean; id: number }> {
  return adminApi.delete(`admin/media/${id}${force ? '?force=1' : ''}`);
}
