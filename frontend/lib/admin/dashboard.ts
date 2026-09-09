'use client';

import { adminApi } from './http';

export interface ContentCount {
  type: string;
  label: string;
  draft: number;
  published: number;
  archived: number;
  total: number;
}

export interface AttentionItem {
  type: string;
  reason: string;
  message: string;
  count: number;
}

export interface DashboardActivity {
  id: number;
  action: string;
  auditable_type: string;
  auditable_id: number;
  user: string | null;
  created_at: string;
}

export interface Dashboard {
  content: ContentCount[];
  totals: { published: number; draft: number; media: number; new_leads: number };
  needs_attention: AttentionItem[];
  recent_activity: DashboardActivity[];
  leads: { total: number; new: number; last_7_days: number; last_30_days: number };
}

export const dashboardQueryKey = ['admin', 'dashboard'] as const;

export function getDashboard(signal?: AbortSignal): Promise<Dashboard> {
  return adminApi.get<Dashboard>('admin/dashboard', signal);
}
