import 'server-only';
import type { TechnologyDetail, TechnologySummary } from '@/types/technology';
import { apiGet, apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';

/** All published technologies, display order. */
export async function getTechnologies(): Promise<TechnologySummary[]> {
  try {
    const { data } = await apiList<TechnologySummary>('technologies', {
      tags: [cacheTags.technologies],
    });
    return data;
  } catch (error) {
    return rethrowUnlessBuild(error, [] as TechnologySummary[]);
  }
}

/** One technology, or `null` if unknown. */
export async function getTechnology(slug: string): Promise<TechnologyDetail | null> {
  try {
    return await apiGet<TechnologyDetail>(`technologies/${slug}`, {
      tags: [cacheTags.technologies, cacheTags.technology(slug)],
    });
  } catch (error) {
    return rethrowUnlessBuild(error, null, { notFoundAsNull: true });
  }
}
