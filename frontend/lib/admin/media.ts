'use client';

import { adminApi, type AdminPaginated } from './http';

export interface AdminMedia {
  id: number;
  name: string;
  alt_text: string | null;
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

const KEY = ['admin', 'media'] as const;

export const mediaQueryKeys = {
  all: KEY,
  list: (page: number) => [...KEY, 'list', page] as const,
};

export function listMedia(page: number, signal?: AbortSignal): Promise<AdminPaginated<AdminMedia>> {
  return adminApi.getPage<AdminMedia>('admin/media', { signal, query: { page } });
}

export function uploadMedia(file: File): Promise<AdminMedia> {
  const form = new FormData();
  form.append('file', file);
  return adminApi.post<AdminMedia>('admin/media', form);
}

export function updateMedia(
  id: number,
  input: { name?: string; alt_text?: string | null },
): Promise<AdminMedia> {
  return adminApi.patch<AdminMedia>(`admin/media/${id}`, input);
}

export function deleteMedia(id: number): Promise<{ deleted: boolean; id: number }> {
  return adminApi.delete(`admin/media/${id}`);
}
