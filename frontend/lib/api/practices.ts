import 'server-only';
import type { PracticeDetail, PracticeSummary, SubServiceDetail } from '@/types/practice';
import { apiGet, apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';

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
    return rethrowUnlessBuild(error, null, { notFoundAsNull: true });
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
