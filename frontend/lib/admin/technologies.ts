'use client';

import { adminApi } from './http';
import type { ContentStatus } from './types';

const KEY = ['admin', 'technologies'] as const;

export const technologyQueryKeys = {
  all: KEY,
  detail: (slug: string) => [...KEY, slug] as const,
};

export type AdminTechnology = {
  id: number;
  name: string;
  slug: string;
  summary: string | null;
  icon: string | null;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type TechnologyInput = {
  name: string;
  slug: string;
  summary: string | null;
  icon: string | null;
  status?: ContentStatus;
  sort_order?: number;
};

export function listTechnologies(signal?: AbortSignal): Promise<AdminTechnology[]> {
  return adminApi.get<AdminTechnology[]>('admin/technologies', signal);
}

export function getTechnology(slug: string, signal?: AbortSignal): Promise<AdminTechnology> {
  return adminApi.get<AdminTechnology>(`admin/technologies/${slug}`, signal);
}

export function createTechnology(input: TechnologyInput): Promise<AdminTechnology> {
  return adminApi.post<AdminTechnology>('technologies', input);
}

export function updateTechnology(slug: string, input: Partial<TechnologyInput>): Promise<AdminTechnology> {
  return adminApi.put<AdminTechnology>(`technologies/${slug}`, input);
}

export function setTechnologyStatus(slug: string, status: ContentStatus): Promise<AdminTechnology> {
  return adminApi.put<AdminTechnology>(`admin/content/technologies/${slug}/status`, { status });
}

export function deleteTechnology(slug: string): Promise<{ deleted: boolean; slug: string }> {
  return adminApi.delete(`technologies/${slug}`);
}
