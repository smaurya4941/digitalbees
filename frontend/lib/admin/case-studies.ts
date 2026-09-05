'use client';

import { adminApi } from './http';
import type { ContentStatus } from './types';

const KEY = ['admin', 'case-studies'] as const;

export const caseStudyQueryKeys = {
  all: KEY,
  detail: (slug: string) => [...KEY, slug] as const,
};

export type AdminCaseStudy = {
  id: number;
  title: string;
  slug: string;
  client_name: string | null;
  summary: string | null;
  challenge: string | null;
  solution: string | null;
  impact: string | null;
  hero_image: string | null;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CaseStudyInput = {
  title: string;
  slug: string;
  client_name: string | null;
  summary: string | null;
  challenge: string | null;
  solution: string | null;
  impact: string | null;
  hero_image: string | null;
  status?: ContentStatus;
  sort_order?: number;
};

export function listCaseStudies(signal?: AbortSignal): Promise<AdminCaseStudy[]> {
  return adminApi.get<AdminCaseStudy[]>('admin/case-studies', signal);
}

export function getCaseStudy(slug: string, signal?: AbortSignal): Promise<AdminCaseStudy> {
  return adminApi.get<AdminCaseStudy>(`admin/case-studies/${slug}`, signal);
}

export function createCaseStudy(input: CaseStudyInput): Promise<AdminCaseStudy> {
  return adminApi.post<AdminCaseStudy>('case-studies', input);
}

export function updateCaseStudy(slug: string, input: Partial<CaseStudyInput>): Promise<AdminCaseStudy> {
  return adminApi.put<AdminCaseStudy>(`case-studies/${slug}`, input);
}

export function setCaseStudyStatus(slug: string, status: ContentStatus): Promise<AdminCaseStudy> {
  return adminApi.put<AdminCaseStudy>(`admin/content/case-studies/${slug}/status`, { status });
}

export function deleteCaseStudy(slug: string): Promise<{ deleted: boolean; slug: string }> {
  return adminApi.delete(`case-studies/${slug}`);
}
