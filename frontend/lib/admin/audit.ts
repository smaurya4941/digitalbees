'use client';

import { adminApi, type AdminPaginated } from './http';

export interface AuditEntry {
  id: number;
  action: string;
  auditable_type: string;
  auditable_id: number;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  user: { id: number; name: string; email: string } | null;
  created_at: string;
}

export type AuditFilters = {
  auditable_type?: string;
  action?: string;
  page?: number;
};

export type AuditPage = AdminPaginated<AuditEntry> & { meta: { actions: string[] } };

const KEY = ['admin', 'audit'] as const;

export const auditQueryKeys = {
  all: KEY,
  list: (filters: AuditFilters) => [...KEY, filters] as const,
};

export function listAuditLogs(filters: AuditFilters, signal?: AbortSignal): Promise<AuditPage> {
  return adminApi.getPage<AuditEntry>('admin/audit-logs', {
    signal,
    query: {
      auditable_type: filters.auditable_type || undefined,
      action: filters.action || undefined,
      page: filters.page,
    },
  }) as Promise<AuditPage>;
}
