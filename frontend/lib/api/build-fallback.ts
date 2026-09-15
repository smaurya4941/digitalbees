import 'server-only';
import { ApiError } from './client';

/**
 * During `next build` the API may not be reachable (CI without a running
 * backend). We don't want that to fail the build — pages fall back to
 * on-demand ISR and fill in on first request. At runtime, errors propagate.
 */
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

type Options = {
  /** Treat a 404 as "no such entity" and return the fallback, at build or runtime. */
  notFoundAsNull?: boolean;
};

export function rethrowUnlessBuild<T>(
  error: unknown,
  fallback: T,
  { notFoundAsNull = false }: Options = {},
): T {
  if (notFoundAsNull && error instanceof ApiError && error.isNotFound) {
    return fallback;
  }
  if (isBuildPhase && error instanceof ApiError && error.status === 0) {
    console.warn('[api] backend unreachable during build; deferring to ISR:', error.message);
    return fallback;
  }
  throw error;
}
