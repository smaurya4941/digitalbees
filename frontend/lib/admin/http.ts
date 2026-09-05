'use client';

import { clientEnv } from '@/config/environment';

/**
 * Browser-side API client for the admin panel.
 *
 * Auth is Laravel Sanctum SPA: the session lives in an HTTP-only cookie, so
 * every request sends `credentials: 'include'`. Mutations echo the readable
 * `XSRF-TOKEN` cookie back in the `X-XSRF-TOKEN` header; we prime that cookie
 * from `/sanctum/csrf-cookie` on demand.
 *
 * This module is never imported by Server Components — the public site uses
 * `lib/api/client.ts` (server-only) instead.
 */

const API = clientEnv.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
const ORIGIN = clientEnv.NEXT_PUBLIC_API_ORIGIN.replace(/\/$/, '');

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = 'AdminApiError';
  }

  /** First message for a field, if the server returned validation errors. */
  fieldError(field: string): string | undefined {
    return this.errors[field]?.[0];
  }

  get isUnauthenticated(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

let csrfPrimed = false;

async function ensureCsrfCookie(force = false): Promise<void> {
  if (csrfPrimed && !force && readCookie('XSRF-TOKEN')) return;
  await fetch(`${ORIGIN}/sanctum/csrf-cookie`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  csrfPrimed = true;
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
};

async function raw<T>(path: string, options: RequestOptions, retryOnCsrf = true): Promise<T> {
  const method = options.method ?? 'GET';
  const mutating = method !== 'GET';

  if (mutating) await ensureCsrfCookie();

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  const xsrf = readCookie('XSRF-TOKEN');
  if (mutating && xsrf) headers['X-XSRF-TOKEN'] = xsrf;

  const response = await fetch(`${API}/${path.replace(/^\//, '')}`, {
    method,
    credentials: 'include',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  // Stale CSRF token — re-prime once and retry.
  if (response.status === 419 && retryOnCsrf) {
    await ensureCsrfCookie(true);
    return raw<T>(path, options, false);
  }

  const payload = (await response.json().catch(() => null)) as
    | { data?: unknown; message?: string; errors?: Record<string, string[]> }
    | null;

  if (!response.ok) {
    throw new AdminApiError(
      payload?.message ?? `Request failed (${response.status})`,
      response.status,
      payload?.errors ?? {},
    );
  }

  return (payload?.data ?? null) as T;
}

export const adminApi = {
  get: <T>(path: string, signal?: AbortSignal) => raw<T>(path, { method: 'GET', signal }),
  post: <T>(path: string, body?: unknown) => raw<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => raw<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => raw<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => raw<T>(path, { method: 'DELETE' }),
  primeCsrf: () => ensureCsrfCookie(true),
};
