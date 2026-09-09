'use client';

import { adminApi } from './http';

export interface NavChild {
  id?: number;
  label: string;
  url: string | null;
  is_active: boolean;
}

export interface NavItem extends NavChild {
  children: NavChild[];
}

export interface NavMenu {
  key_name: string;
  label: string | null;
  items: NavItem[];
}

export const navigationQueryKey = ['admin', 'navigation'] as const;

export function listNavigation(signal?: AbortSignal): Promise<NavMenu[]> {
  return adminApi.get<NavMenu[]>('admin/navigation', signal);
}

export function updateNavigation(keyName: string, items: NavItem[]): Promise<NavMenu[]> {
  return adminApi.patch<NavMenu[]>(`admin/navigation/${keyName}`, { items });
}
