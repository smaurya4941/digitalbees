'use client';

import { adminApi, type AdminPaginated } from './http';
import type { AdminTestimonial, TaxonomyListFilters, TestimonialInput, TestimonialStatus } from './types';

const KEY = ['admin', 'testimonials'] as const;

export const testimonialQueryKeys = {
  all: KEY,
  list: (filters: TaxonomyListFilters) => [...KEY, 'list', filters] as const,
  detail: (id: number) => [...KEY, id] as const,
};

export function listTestimonials(
  filters: TaxonomyListFilters,
  signal?: AbortSignal,
): Promise<AdminPaginated<AdminTestimonial>> {
  return adminApi.getPage<AdminTestimonial>('admin/testimonials', {
    signal,
    query: {
      q: filters.q || undefined,
      status: filters.status || undefined,
      page: filters.page,
      sort: filters.sort,
    },
  });
}

export function getTestimonial(id: number, signal?: AbortSignal): Promise<AdminTestimonial> {
  return adminApi.get<AdminTestimonial>(`admin/testimonials/${id}`, signal);
}

export function createTestimonial(input: TestimonialInput): Promise<AdminTestimonial> {
  return adminApi.post<AdminTestimonial>('testimonials', input);
}

export function updateTestimonial(id: number, input: Partial<TestimonialInput>): Promise<AdminTestimonial> {
  return adminApi.put<AdminTestimonial>(`testimonials/${id}`, input);
}

export function setTestimonialStatus(id: number, status: TestimonialStatus): Promise<AdminTestimonial> {
  return adminApi.put<AdminTestimonial>(`testimonials/${id}`, { status });
}

export function deleteTestimonial(id: number): Promise<{ deleted: boolean; id: number }> {
  return adminApi.delete(`testimonials/${id}`);
}
