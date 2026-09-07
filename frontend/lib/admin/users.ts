'use client';

import { adminApi, type AdminPaginated } from './http';

export type UserStatus = 'active' | 'invited' | 'suspended';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  role: string | null;
  last_login_at: string | null;
  invitation_sent_at: string | null;
  created_at: string;
}

export type UsersPage = AdminPaginated<AdminUser> & {
  meta: { statuses: UserStatus[]; roles: string[] };
};

export interface UserFilters {
  q?: string;
  status?: string;
  role?: string;
  page?: number;
}

const KEY = ['admin', 'users'] as const;

export const userQueryKeys = {
  all: KEY,
  list: (filters: UserFilters) => [...KEY, 'list', filters] as const,
  detail: (id: number) => [...KEY, 'detail', id] as const,
};

export function listUsers(filters: UserFilters, signal?: AbortSignal): Promise<UsersPage> {
  return adminApi.getPage<AdminUser>('admin/users', {
    signal,
    query: {
      q: filters.q || undefined,
      status: filters.status || undefined,
      role: filters.role || undefined,
      page: filters.page,
    },
  }) as Promise<UsersPage>;
}

export function getUser(id: number, signal?: AbortSignal): Promise<AdminUser> {
  return adminApi.get<AdminUser>(`admin/users/${id}`, signal);
}

export function inviteUser(input: { name: string; email: string; role: string }): Promise<AdminUser> {
  return adminApi.post<AdminUser>('admin/users', input);
}

export function updateUser(id: number, input: { name?: string; role?: string }): Promise<AdminUser> {
  return adminApi.patch<AdminUser>(`admin/users/${id}`, input);
}

export function suspendUser(id: number): Promise<AdminUser> {
  return adminApi.post<AdminUser>(`admin/users/${id}/suspend`);
}

export function reactivateUser(id: number): Promise<AdminUser> {
  return adminApi.post<AdminUser>(`admin/users/${id}/reactivate`);
}

export function resendInvite(id: number): Promise<AdminUser> {
  return adminApi.post<AdminUser>(`admin/users/${id}/resend-invite`);
}

export function deleteUser(id: number): Promise<{ deleted: boolean; id: number }> {
  return adminApi.delete(`admin/users/${id}`);
}

/* --- Public invitation acceptance (no session) --------------------------- */

export function getInvitation(token: string, signal?: AbortSignal): Promise<{ name: string; email: string }> {
  return adminApi.get<{ name: string; email: string }>(`invitations/${token}`, signal);
}

export function acceptInvitation(input: {
  token: string;
  password: string;
  password_confirmation: string;
}): Promise<{ status: string }> {
  return adminApi.post<{ status: string }>('invitations/accept', input);
}
