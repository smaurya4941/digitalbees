import 'server-only';
import type { PracticeDetail, PracticeSummary } from '@/types/practice';
import { apiGet, apiList, ApiError } from './client';
import { cacheTags } from './tags';

/** All published practices, display order. */
export async function getPractices(): Promise<PracticeSummary[]> {
  const { data } = await apiList<PracticeSummary>('practices', {
    tags: [cacheTags.practices],
  });
  return data;
}

/** One practice with everything the `practice` template needs, or `null` if unknown. */
export async function getPractice(slug: string): Promise<PracticeDetail | null> {
  try {
    return await apiGet<PracticeDetail>(`practices/${slug}`, {
      tags: [cacheTags.practices, cacheTags.practice(slug)],
    });
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) return null;
    throw error;
  }
}
