'use client';

import { adminApi, type AdminPaginated } from './http';
import type { AdminFaq, FaqInput, FaqStatus, TaxonomyListFilters } from './types';

const KEY = ['admin', 'faqs'] as const;

export const faqQueryKeys = {
  all: KEY,
  list: (filters: TaxonomyListFilters & { faqable_type?: string; faqable_id?: number }) =>
    [...KEY, 'list', filters] as const,
  detail: (id: number) => [...KEY, id] as const,
};

export function listFaqs(
  filters: TaxonomyListFilters & { faqable_type?: string; faqable_id?: number },
  signal?: AbortSignal,
): Promise<AdminPaginated<AdminFaq>> {
  return adminApi.getPage<AdminFaq>('admin/faqs', {
    signal,
    query: {
      q: filters.q || undefined,
      status: filters.status || undefined,
      faqable_type: filters.faqable_type || undefined,
      faqable_id: filters.faqable_id || undefined,
      page: filters.page,
      sort: filters.sort,
    },
  });
}

export function getFaq(id: number, signal?: AbortSignal): Promise<AdminFaq> {
  return adminApi.get<AdminFaq>(`admin/faqs/${id}`, signal);
}

export function createFaq(input: FaqInput): Promise<AdminFaq> {
  return adminApi.post<AdminFaq>('faqs', input);
}

export function updateFaq(id: number, input: Partial<FaqInput>): Promise<AdminFaq> {
  return adminApi.put<AdminFaq>(`faqs/${id}`, input);
}

export function setFaqStatus(id: number, status: FaqStatus): Promise<AdminFaq> {
  return adminApi.put<AdminFaq>(`faqs/${id}`, { status });
}

export function deleteFaq(id: number): Promise<{ deleted: boolean; id: number }> {
  return adminApi.delete(`faqs/${id}`);
}
