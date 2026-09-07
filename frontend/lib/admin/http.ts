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

/** Page-number pagination envelope returned by back-office list endpoints. */
export interface AdminPaginated<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  } & Record<string, unknown>;
  links: { prev: string | null; next: string | null };
}

type QueryValue = string | number | boolean | null | undefined;
export type Query = Record<string, QueryValue>;

interface GetOptions {
  signal?: AbortSignal;
  query?: Query;
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function withQuery(path: string, query?: Query): string {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  if (!qs) return path;
  return `${path}${path.includes('?') ? '&' : '?'}${qs}`;
}

/** GET calls take either an AbortSignal (legacy) or an options object. */
function normalizeGetArgs(arg?: AbortSignal | GetOptions): GetOptions {
  if (!arg) return {};
  if (arg instanceof AbortSignal) return { signal: arg };
  return arg;
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

type Envelope = {
  data?: unknown;
  meta?: unknown;
  links?: unknown;
  message?: string;
  errors?: Record<string, string[]>;
};

/**
 * Performs the request and returns the parsed envelope. Throws AdminApiError
 * on any non-2xx response. Callers decide whether they want `.data` only
 * (`raw`) or the whole envelope (`rawEnvelope`).
 */
async function send(path: string, options: RequestOptions, retryOnCsrf = true): Promise<Envelope> {
  const method = options.method ?? 'GET';
  const mutating = method !== 'GET';
  const isForm = options.body instanceof FormData;

  if (mutating) await ensureCsrfCookie();

  const headers: Record<string, string> = { Accept: 'application/json' };
  // Let the browser set the multipart boundary for FormData bodies.
  if (options.body !== undefined && !isForm) headers['Content-Type'] = 'application/json';

  const xsrf = readCookie('XSRF-TOKEN');
  if (mutating && xsrf) headers['X-XSRF-TOKEN'] = xsrf;

  const response = await fetch(`${API}/${path.replace(/^\//, '')}`, {
    method,
    credentials: 'include',
    headers,
    body:
      options.body === undefined
        ? undefined
        : isForm
          ? (options.body as FormData)
          : JSON.stringify(options.body),
    signal: options.signal,
  });

  // Stale CSRF token — re-prime once and retry.
  if (response.status === 419 && retryOnCsrf) {
    await ensureCsrfCookie(true);
    return send(path, options, false);
  }

  const payload = (await response.json().catch(() => null)) as Envelope | null;

  if (!response.ok) {
    throw new AdminApiError(
      payload?.message ?? `Request failed (${response.status})`,
      response.status,
      payload?.errors ?? {},
    );
  }

  return payload ?? {};
}

async function raw<T>(path: string, options: RequestOptions): Promise<T> {
  const payload = await send(path, options);
  return (payload.data ?? null) as T;
}

async function rawEnvelope<T>(path: string, options: RequestOptions): Promise<T> {
  return (await send(path, options)) as T;
}

export const adminApi = {
  get: <T>(path: string, arg?: AbortSignal | GetOptions) => {
    const { signal, query } = normalizeGetArgs(arg);
    return raw<T>(withQuery(path, query), { method: 'GET', signal });
  },
  /** GET a list endpoint, keeping the `{ data, meta, links }` envelope intact. */
  getPage: <T>(path: string, arg?: AbortSignal | GetOptions) => {
    const { signal, query } = normalizeGetArgs(arg);
    return rawEnvelope<AdminPaginated<T>>(withQuery(path, query), { method: 'GET', signal });
  },
  post: <T>(path: string, body?: unknown) => raw<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => raw<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => raw<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => raw<T>(path, { method: 'DELETE' }),
  primeCsrf: () => ensureCsrfCookie(true),
};
