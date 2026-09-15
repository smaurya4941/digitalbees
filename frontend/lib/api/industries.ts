import 'server-only';
import type { IndustryDetail, IndustrySummary } from '@/types/industry';
import { apiGet, apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';

/** All published industries, display order. */
export async function getIndustries(): Promise<IndustrySummary[]> {
  try {
    const { data } = await apiList<IndustrySummary>('industries', {
      tags: [cacheTags.industries],
    });
    return data;
  } catch (error) {
    return rethrowUnlessBuild(error, [] as IndustrySummary[]);
  }
}

/** One industry with everything the `industry` template needs, or `null` if unknown. */
export async function getIndustry(slug: string): Promise<IndustryDetail | null> {
  try {
    return await apiGet<IndustryDetail>(`industries/${slug}`, {
      tags: [cacheTags.industries, cacheTags.industry(slug)],
    });
  } catch (error) {
    return rethrowUnlessBuild(error, null, { notFoundAsNull: true });
  }
}
