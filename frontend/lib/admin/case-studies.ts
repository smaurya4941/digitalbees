'use client';

import { adminApi, type AdminPaginated } from './http';
import type { ContentStatus, TaxonomyListFilters } from './types';

const KEY = ['admin', 'case-studies'] as const;

export const caseStudyQueryKeys = {
  all: KEY,
  list: (filters: TaxonomyListFilters) => [...KEY, 'list', filters] as const,
  detail: (slug: string) => [...KEY, slug] as const,
};

export type CaseStudyMetricInput = { value: string; label: string };
export type CaseStudyStepInput = { title: string; description: string | null };

/** Links shown on the public page (and that surface the study on those pages). */
export type CaseStudyRelationIds = {
  practice_ids: number[];
  industry_ids: number[];
  technology_ids: number[];
  region_ids: number[];
};

export type AdminCaseStudy = CaseStudyRelationIds & {
  id: number;
  title: string;
  slug: string;
  client_name: string | null;
  summary: string | null;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  metrics: CaseStudyMetricInput[];
  how_it_works: Array<CaseStudyStepInput & { step?: number }>;
  capabilities_used: string[];
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CaseStudyInput = CaseStudyRelationIds & {
  title: string;
  slug: string;
  client_name: string | null;
  summary: string | null;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  metrics: CaseStudyMetricInput[];
  how_it_works: CaseStudyStepInput[];
  capabilities_used: string[];
  status?: ContentStatus;
};

export function listCaseStudies(
  filters: TaxonomyListFilters,
  signal?: AbortSignal,
): Promise<AdminPaginated<AdminCaseStudy>> {
  return adminApi.getPage<AdminCaseStudy>('admin/case-studies', {
    signal,
    query: {
      q: filters.q || undefined,
      status: filters.status || undefined,
      page: filters.page,
      sort: filters.sort,
    },
  });
}

/** Every case study (any status) as picker options — capped at the admin API's 100-row page. */
export async function listCaseStudyOptions(signal?: AbortSignal): Promise<Array<{ id: number; title: string; status: ContentStatus }>> {
  const page = await adminApi.getPage<AdminCaseStudy>('admin/case-studies', {
    signal,
    query: { per_page: 100, sort: 'title' },
  });
  return page.data.map(({ id, title, status }) => ({ id, title, status }));
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
