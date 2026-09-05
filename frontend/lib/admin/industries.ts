'use client';

import { adminApi } from './http';
import type { ContentStatus } from './types';

const KEY = ['admin', 'industries'] as const;

export const industryQueryKeys = {
  all: KEY,
  detail: (slug: string) => [...KEY, slug] as const,
};

// We will redefine AdminIndustry and IndustryInput here since we shouldn't rely on Practice types
export type AdminIndustry = {
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

export type IndustryInput = {
  name: string;
  slug: string;
  summary: string | null;
  icon: string | null;
  status?: ContentStatus;
  sort_order?: number;
};

export function listIndustries(signal?: AbortSignal): Promise<AdminIndustry[]> {
  return adminApi.get<AdminIndustry[]>('admin/industries', signal);
}

export function getIndustry(slug: string, signal?: AbortSignal): Promise<AdminIndustry> {
  return adminApi.get<AdminIndustry>(`admin/industries/${slug}`, signal);
}

export function createIndustry(input: IndustryInput): Promise<AdminIndustry> {
  return adminApi.post<AdminIndustry>('industries', input);
}

export function updateIndustry(slug: string, input: Partial<IndustryInput>): Promise<AdminIndustry> {
  return adminApi.put<AdminIndustry>(`industries/${slug}`, input);
}

export function setIndustryStatus(slug: string, status: ContentStatus): Promise<AdminIndustry> {
  return adminApi.put<AdminIndustry>(`admin/content/industries/${slug}/status`, { status }); // Using the status update endpoint
}

export function deleteIndustry(slug: string): Promise<{ deleted: boolean; slug: string }> {
  return adminApi.delete(`industries/${slug}`);
}
