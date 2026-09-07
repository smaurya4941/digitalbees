'use client';

import { adminApi } from './http';

export interface AdminRole {
  id: number;
  name: string;
  description: string | null;
  users_count: number;
  is_builtin: boolean;
  is_admin: boolean;
  permissions: string[];
}

export interface PermissionCatalogEntry {
  name: string;
  description: string | null;
}

/** group name -> permissions in that group */
export type PermissionCatalog = Record<string, PermissionCatalogEntry[]>;

export interface RolesEnvelope {
  data: AdminRole[];
  meta: { permissions: PermissionCatalog; builtin: string[] };
}

export interface RoleInput {
  name?: string;
  description?: string | null;
  permissions?: string[];
}

const KEY = ['admin', 'roles'] as const;

export const roleQueryKeys = {
  all: KEY,
  detail: (id: number) => [...KEY, id] as const,
};

export function listRoles(signal?: AbortSignal): Promise<RolesEnvelope> {
  return adminApi.getEnvelope<RolesEnvelope>('admin/roles', signal);
}

export function createRole(input: RoleInput): Promise<AdminRole> {
  return adminApi.post<AdminRole>('admin/roles', input);
}

export function updateRole(id: number, input: RoleInput): Promise<AdminRole> {
  return adminApi.patch<AdminRole>(`admin/roles/${id}`, input);
}

export function deleteRole(id: number): Promise<{ deleted: boolean; id: number }> {
  return adminApi.delete(`admin/roles/${id}`);
}
