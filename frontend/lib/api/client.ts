import 'server-only';
import { serverEnv } from '@/config/environment';
import type { ApiEnvelope, EnvelopeLinks, EnvelopeMeta } from '@/types/pagination';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly path: string,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

type RequestOptions = {
  /** Cache tags for on-demand revalidation (see app/api/revalidate). */
  tags?: string[];
  /** Time-based revalidation in seconds. Default: 1h. `false` = no store. */
  revalidate?: number | false;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
};

const DEFAULT_REVALIDATE = 3600;

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const base = serverEnv().API_BASE_URL.replace(/\/$/, '');
  const url = new URL(`${base}/${path.replace(/^\//, '')}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function request<T>(path: string, options: RequestOptions): Promise<ApiEnvelope<T>> {
  const url = buildUrl(path, options.query);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: options.signal,
      next:
        options.revalidate === false
          ? { revalidate: 0, tags: options.tags }
          : { revalidate: options.revalidate ?? DEFAULT_REVALIDATE, tags: options.tags },
      ...(options.revalidate === false ? { cache: 'no-store' as const } : {}),
    });
  } catch (cause) {
    throw new ApiError(`Network error calling ${path}`, 0, path, cause);
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      typeof payload === 'object' && payload && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : `API ${response.status} for ${path}`,
      response.status,
      path,
      payload,
    );
  }

  return payload as ApiEnvelope<T>;
}

/** Fetch and unwrap a single resource (`{ data: T }`). */
export async function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const envelope = await request<T>(path, options);
  return envelope.data;
}

/** Fetch a collection with its envelope meta/links intact. */
export async function apiList<T>(
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T[]; meta: EnvelopeMeta; links: EnvelopeLinks }> {
  const envelope = await request<T[]>(path, options);
  return { data: envelope.data, meta: envelope.meta, links: envelope.links ?? {} };
}
