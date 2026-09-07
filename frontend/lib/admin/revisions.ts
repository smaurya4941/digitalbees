'use client';

import { adminApi } from './http';

/** A content type's URL segment, e.g. `practices`, `case-studies`. */
export type RevisionContentType =
  | 'practices'
  | 'industries'
  | 'regions'
  | 'technologies'
  | 'case-studies'
  | 'resources'
  | 'careers'
  | 'locations';

export interface RevisionAuthor {
  id: number;
  name: string;
}

export interface RevisionListItem {
  id: number;
  summary: string | null;
  created_at: string;
  author: RevisionAuthor | null;
  /** Field names that changed relative to the previous (older) revision. */
  changed_fields: string[];
}

export interface RevisionDetail {
  revision: {
    id: number;
    summary: string | null;
    created_at: string;
    author: RevisionAuthor | null;
    fields: Record<string, unknown>;
    seo: Record<string, unknown> | null;
  };
  current: {
    fields: Record<string, unknown>;
    seo: Record<string, unknown> | null;
  };
}

export interface RestoreResult {
  type: string;
  slug: string;
  restored_from: number;
  fields: Record<string, unknown>;
}

const KEY = ['admin', 'revisions'] as const;

export const revisionQueryKeys = {
  all: KEY,
  list: (type: string, slug: string) => [...KEY, type, slug] as const,
  detail: (type: string, slug: string, id: number) => [...KEY, type, slug, id] as const,
};

export function listRevisions(
  type: RevisionContentType,
  slug: string,
  signal?: AbortSignal,
): Promise<{ data: RevisionListItem[]; meta: { keep: number } }> {
  return adminApi.getEnvelope(`admin/${type}/${slug}/revisions`, { signal });
}

export function getRevision(
  type: RevisionContentType,
  slug: string,
  id: number,
  signal?: AbortSignal,
): Promise<RevisionDetail> {
  return adminApi.get<RevisionDetail>(`admin/${type}/${slug}/revisions/${id}`, signal);
}

export function restoreRevision(
  type: RevisionContentType,
  slug: string,
  id: number,
): Promise<RestoreResult> {
  return adminApi.post<RestoreResult>(`admin/${type}/${slug}/revisions/${id}/restore`);
}
