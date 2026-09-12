'use client';

import { adminApi, AdminApiError } from './http';
import type { AuthUser } from './types';

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  await adminApi.primeCsrf();
  return adminApi.post<AuthUser>('login', credentials);
}

export async function logout(): Promise<void> {
  try {
    await adminApi.post('logout');
  } catch (error) {
    if (error instanceof AdminApiError && error.isUnauthenticated) {
      return;
    }
    // Don't crash client on signout failure
  }
}

export async function fetchCurrentUser(signal?: AbortSignal): Promise<AuthUser> {
  return adminApi.get<AuthUser>('user', signal);
}
