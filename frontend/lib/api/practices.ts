import 'server-only';
import type { PracticeDetail, PracticeSummary, SubServiceDetail } from '@/types/practice';
import { apiGet, apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';
import {
  getFallbackPractice,
  getFallbackPractices,
} from '@/lib/data/fallback-practices';

/** All published practices, display order. */
export async function getPractices(): Promise<PracticeSummary[]> {
  try {
    const { data } = await apiList<PracticeSummary>('practices', {
      tags: [cacheTags.practices],
    });
    if (data && data.length > 0) return data;
    return getFallbackPractices();
  } catch (_error) {
    return getFallbackPractices();
  }
}

/** One practice with everything the `practice` template needs, or `null` if unknown. */
export async function getPractice(slug: string): Promise<PracticeDetail | null> {
  try {
    const data = await apiGet<PracticeDetail>(`practices/${slug}`, {
      tags: [cacheTags.practices, cacheTags.practice(slug)],
    });
    if (data) return data;
    return getFallbackPractice(slug);
  } catch (_error) {
    return getFallbackPractice(slug);
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
