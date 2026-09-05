'use client';

import { adminApi } from './http';
import type { AdminPractice, ContentStatus, PracticeInput } from './types';

const KEY = ['admin', 'practices'] as const;

export const practiceQueryKeys = {
  all: KEY,
  detail: (slug: string) => [...KEY, slug] as const,
};

export function listPractices(signal?: AbortSignal): Promise<AdminPractice[]> {
  return adminApi.get<AdminPractice[]>('admin/practices', signal);
}

export function getPractice(slug: string, signal?: AbortSignal): Promise<AdminPractice> {
  return adminApi.get<AdminPractice>(`admin/practices/${slug}`, signal);
}

export function createPractice(input: PracticeInput): Promise<AdminPractice> {
  return adminApi.post<AdminPractice>('practices', input);
}

export function updatePractice(slug: string, input: Partial<PracticeInput>): Promise<AdminPractice> {
  return adminApi.put<AdminPractice>(`practices/${slug}`, input);
}

export function setPracticeStatus(slug: string, status: ContentStatus): Promise<AdminPractice> {
  return adminApi.put<AdminPractice>(`practices/${slug}`, { status });
}

export function deletePractice(slug: string): Promise<{ deleted: boolean; slug: string }> {
  return adminApi.delete(`practices/${slug}`);
}
