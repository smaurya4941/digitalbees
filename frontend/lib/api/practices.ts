import 'server-only';
import type { PracticeDetail, PracticeSummary } from '@/types/practice';
import { apiGet, apiList, ApiError } from './client';
import { cacheTags } from './tags';

/**
 * During `next build` the API may not be reachable (CI without a running
 * backend). We don't want that to fail the build — pages fall back to
 * on-demand ISR and fill in on first request. At runtime, errors propagate.
 */
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

function rethrowUnlessBuild<T>(error: unknown, fallback: T): T {
  if (isBuildPhase && error instanceof ApiError && error.status === 0) {
    console.warn('[api] backend unreachable during build; deferring to ISR:', error.message);
    return fallback;
  }
  throw error;
}

/** All published practices, display order. */
export async function getPractices(): Promise<PracticeSummary[]> {
  try {
    const { data } = await apiList<PracticeSummary>('practices', {
      tags: [cacheTags.practices],
    });
    return data;
  } catch (error) {
    return rethrowUnlessBuild(error, [] as PracticeSummary[]);
  }
}

/** One practice with everything the `practice` template needs, or `null` if unknown. */
export async function getPractice(slug: string): Promise<PracticeDetail | null> {
  try {
    return await apiGet<PracticeDetail>(`practices/${slug}`, {
      tags: [cacheTags.practices, cacheTags.practice(slug)],
    });
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) return null;
    return rethrowUnlessBuild(error, null);
  }
}
