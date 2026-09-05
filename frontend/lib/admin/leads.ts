'use client';

import { adminApi } from './http';

export type LeadStatus = 'new' | 'synced' | 'failed' | 'duplicate';

export type AdminLead = {
  id: number;
  source_page_id: number | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  form_type: string;
  utm: any;
  score: number;
  status: LeadStatus;
  crm_reference_id: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
};

export type PaginatedLeads = {
  data: AdminLead[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  statuses: LeadStatus[];
};

const KEY = ['admin', 'leads'] as const;

export const leadQueryKeys = {
  all: KEY,
  list: (filters: { status?: string; page?: number }) => [...KEY, 'list', filters] as const,
  detail: (id: number) => [...KEY, 'detail', id] as const,
};

export function listLeads(filters: { status?: string; page?: number }, signal?: AbortSignal): Promise<PaginatedLeads> {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.page) params.append('page', filters.page.toString());
  
  return adminApi.get<PaginatedLeads>(`admin/leads?${params.toString()}`, signal);
}

export function getLead(id: number, signal?: AbortSignal): Promise<AdminLead> {
  return adminApi.get<AdminLead>(`admin/leads/${id}`, signal);
}

export function setLeadStatus(id: number, status: LeadStatus): Promise<AdminLead> {
  return adminApi.patch<AdminLead>(`admin/leads/${id}/status`, { status });
}
