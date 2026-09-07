'use client';

import { adminApi, type AdminPaginated } from './http';

export type JobStatus = 'draft' | 'open' | 'closed';
export type EmploymentType = 'full_time' | 'part_time' | 'contract';

export const JOB_STATUSES: JobStatus[] = ['draft', 'open', 'closed'];
export const EMPLOYMENT_TYPES: EmploymentType[] = ['full_time', 'part_time', 'contract'];

export interface AdminJobPosting {
  id: number;
  title: string;
  slug: string;
  location_id: number | null;
  location_name?: string | null;
  employment_type: EmploymentType;
  description: string | null;
  ats_external_id: string | null;
  status: JobStatus;
  applications_count?: number;
  posted_at: string | null;
  closes_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface JobApplication {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  cover_note: string | null;
  status: string;
  created_at: string | null;
}

export interface JobInput {
  title?: string;
  slug?: string;
  location_id?: number | null;
  employment_type?: EmploymentType;
  description?: string | null;
  ats_external_id?: string | null;
  status?: JobStatus;
  closes_at?: string | null;
}

export interface CareerFilters {
  q?: string;
  status?: string;
  page?: number;
}

const KEY = ['admin', 'careers'] as const;

export const careerQueryKeys = {
  all: KEY,
  list: (filters: CareerFilters) => [...KEY, 'list', filters] as const,
  detail: (slug: string) => [...KEY, slug] as const,
  applications: (slug: string, page: number) => [...KEY, slug, 'applications', page] as const,
};

export function listCareers(
  filters: CareerFilters,
  signal?: AbortSignal,
): Promise<AdminPaginated<AdminJobPosting>> {
  return adminApi.getPage<AdminJobPosting>('admin/careers', {
    signal,
    query: { q: filters.q || undefined, status: filters.status || undefined, page: filters.page },
  });
}

export function getCareer(slug: string, signal?: AbortSignal): Promise<AdminJobPosting> {
  return adminApi.get<AdminJobPosting>(`admin/careers/${slug}`, signal);
}

export function listApplications(
  slug: string,
  page: number,
  signal?: AbortSignal,
): Promise<AdminPaginated<JobApplication>> {
  return adminApi.getPage<JobApplication>(`admin/careers/${slug}/applications`, {
    signal,
    query: { page },
  });
}

export function createCareer(input: JobInput): Promise<AdminJobPosting> {
  return adminApi.post<AdminJobPosting>('careers', input);
}

export function updateCareer(slug: string, input: JobInput): Promise<AdminJobPosting> {
  return adminApi.put<AdminJobPosting>(`careers/${slug}`, input);
}

export function setCareerStatus(slug: string, status: JobStatus): Promise<AdminJobPosting> {
  return adminApi.put<AdminJobPosting>(`careers/${slug}`, { status });
}

export function deleteCareer(slug: string): Promise<{ deleted: boolean; slug: string }> {
  return adminApi.delete(`careers/${slug}`);
}
