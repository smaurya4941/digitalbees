'use client';

import { adminApi } from './http';

export interface SeoBlock {
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  robots: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_id: number | null;
}

export interface SeoWarning {
  level: 'warn' | 'error';
  field: string;
  message: string;
}

export interface SeoResponse {
  seo: SeoBlock | null;
  warnings: SeoWarning[];
}

export interface SeoIssue {
  type: string;
  slug: string;
  title: string;
  href: string;
  warnings: SeoWarning[];
}

export const seoQueryKeys = {
  entity: (type: string, slug: string) => ['admin', 'seo', type, slug] as const,
  issues: ['admin', 'seo', 'issues'] as const,
};

export function getSeo(type: string, slug: string, signal?: AbortSignal): Promise<SeoResponse> {
  return adminApi.get<SeoResponse>(`admin/seo/${type}/${slug}`, signal);
}

export function updateSeo(
  type: string,
  slug: string,
  data: Partial<SeoBlock>,
): Promise<SeoResponse> {
  return adminApi.patch<SeoResponse>(`admin/seo/${type}/${slug}`, data);
}

export function listSeoIssues(signal?: AbortSignal): Promise<{ data: SeoIssue[]; meta: { types: string[] } }> {
  return adminApi.getEnvelope<{ data: SeoIssue[]; meta: { types: string[] } }>('admin/seo/issues', signal);
}
