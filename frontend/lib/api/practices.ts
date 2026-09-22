import 'server-only';
import type { PracticeDetail, PracticeSummary, SubServiceDetail } from '@/types/practice';
import { ApiError, apiGet, apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';
import {
  getFallbackPractice,
  getFallbackPractices,
} from '@/lib/data/fallback-practices';

/**
 * True only when the backend could not answer at all (network failure or a
 * 5xx). The static fallback exists to keep the site standing through an API
 * outage — never to paper over a real answer. A 404 or an empty list means
 * the admin deleted, unpublished or archived the practice, and the website
 * must reflect that.
 */
function isOutage(error: unknown): boolean {
  if (!(error instanceof ApiError)) return true;
  return error.status === 0 || error.status >= 500;
}

/** All published practices, display order. */
export async function getPractices(): Promise<PracticeSummary[]> {
  try {
    const { data } = await apiList<PracticeSummary>('practices', {
      tags: [cacheTags.practices],
    });
    return data ?? [];
  } catch (error) {
    if (isOutage(error)) return getFallbackPractices();
    throw error;
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
    if (isOutage(error)) return getFallbackPractice(slug);
    throw error;
  }
}

/** One sub-service with everything the `sub-service` template needs, or `null` if unknown. */
export async function getSubService(practiceSlug: string, subServiceSlug: string): Promise<SubServiceDetail | null> {
  try {
    return await apiGet<SubServiceDetail>(`practices/${practiceSlug}/sub-services/${subServiceSlug}`, {
      tags: [cacheTags.practice(practiceSlug), cacheTags.subService(practiceSlug, subServiceSlug)],
    });
  } catch (error) {
    return rethrowUnlessBuild(error, null, { notFoundAsNull: true });
  }
}
