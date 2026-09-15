'use client';

import { clientEnv } from '@/config/environment';
import type { ApiEnvelope } from '@/types/pagination';

/**
 * Client-side counterpart to `lib/api/client.ts`'s `ApiError` — same shape,
 * usable from Client Components (that file is `server-only`).
 */
export class ClientApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly path: string,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ClientApiError';
  }

  get isValidationError(): boolean {
    return this.status === 422;
  }
}

function buildUrl(path: string): string {
  const base = clientEnv.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/**
 * POST from the browser to a public write endpoint (leads, newsletter,
 * career applications, search-adjacent writes). Never used for admin
 * endpoints — those go through `lib/admin/http.ts`'s cookie-authenticated
 * `adminApi`, a different auth model entirely.
 *
 * Accepts a plain object (sent as JSON) or a `FormData` instance (sent as
 * multipart, for the resume-upload flow) so one helper covers both.
 */
export async function apiPost<T = unknown>(
  path: string,
  body: Record<string, unknown> | FormData,
  options: { signal?: AbortSignal } = {},
): Promise<T> {
  const isFormData = body instanceof FormData;

  let response: Response;
  try {
    response = await fetch(buildUrl(path), {
      method: 'POST',
      headers: isFormData ? { Accept: 'application/json' } : { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: isFormData ? body : JSON.stringify(body),
      signal: options.signal,
    });
  } catch (cause) {
    throw new ClientApiError(`Network error calling ${path}`, 0, path, cause);
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ClientApiError(
      typeof payload === 'object' && payload && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : `API ${response.status} for ${path}`,
      response.status,
      path,
      payload,
    );
  }

  return (payload as ApiEnvelope<T>)?.data ?? (payload as T);
}

/**
 * GET from the browser (used by the client-side search overlay, which needs
 * fresh-per-keystroke results and can't go through the `server-only`
 * `lib/api/client.ts`).
 */
export async function apiGetClient<T>(path: string, query: Record<string, string>, signal?: AbortSignal): Promise<T> {
  const url = new URL(buildUrl(path), typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);

  const response = await fetch(url.toString(), { headers: { Accept: 'application/json' }, signal });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ClientApiError(`API ${response.status} for ${path}`, response.status, path, payload);
  }

  return (payload as ApiEnvelope<T>)?.data ?? (payload as T);
}
