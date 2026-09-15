import 'server-only';
import type { JobPostingDetail, JobPostingSummary } from '@/types/career';
import { apiGet, apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';

/** Every currently-open role. */
export async function getCareers(): Promise<JobPostingSummary[]> {
  try {
    const { data } = await apiList<JobPostingSummary>('careers', {
      tags: [cacheTags.careers],
    });
    return data;
  } catch (error) {
    return rethrowUnlessBuild(error, [] as JobPostingSummary[]);
  }
}

/** One open role, or `null` if unknown or closed. */
export async function getCareer(slug: string): Promise<JobPostingDetail | null> {
  try {
    return await apiGet<JobPostingDetail>(`careers/${slug}`, {
      tags: [cacheTags.careers, cacheTags.career(slug)],
    });
  } catch (error) {
    return rethrowUnlessBuild(error, null, { notFoundAsNull: true });
  }
}
