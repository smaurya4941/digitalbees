import 'server-only';
import type { RegionDetail, RegionSummary } from '@/types/region';
import { apiGet, apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';

/** All published regions, display order. */
export async function getRegions(): Promise<RegionSummary[]> {
  try {
    const { data } = await apiList<RegionSummary>('regions', {
      tags: [cacheTags.regions],
    });
    return data;
  } catch (error) {
    return rethrowUnlessBuild(error, [] as RegionSummary[]);
  }
}

/** One region with everything the `region` template needs, or `null` if unknown. */
export async function getRegion(slug: string): Promise<RegionDetail | null> {
  try {
    return await apiGet<RegionDetail>(`regions/${slug}`, {
      tags: [cacheTags.regions, cacheTags.region(slug)],
    });
  } catch (error) {
    return rethrowUnlessBuild(error, null, { notFoundAsNull: true });
  }
}
