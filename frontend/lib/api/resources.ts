import 'server-only';
import type { ResourceDetail, ResourceSummary, ResourceType } from '@/types/resource';
import type { EnvelopeMeta } from '@/types/pagination';
import { apiGet, apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';

export interface ResourcePage {
  items: ResourceSummary[];
  meta: EnvelopeMeta;
}

const EMPTY_PAGE: ResourcePage = { items: [], meta: {} };

/**
 * Insights = `resources` filtered to `resource_type = blog` (IA §1). The API
 * exposes them as a separate endpoint so the hub and its URLs stay distinct.
 */
export async function getInsights(perPage = 12): Promise<ResourcePage> {
  try {
    const { data, meta } = await apiList<ResourceSummary>('insights', {
      tags: [cacheTags.insights],
      query: { per_page: perPage },
    });
    return { items: data, meta };
  } catch (error) {
    return rethrowUnlessBuild(error, EMPTY_PAGE);
  }
}

/** One insight (a `blog` resource), or `null` if unknown. */
export async function getInsight(slug: string): Promise<ResourceDetail | null> {
  try {
    return await apiGet<ResourceDetail>(`insights/${slug}`, {
      tags: [cacheTags.insights, cacheTags.resource(slug)],
    });
  } catch (error) {
    return rethrowUnlessBuild(error, null, { notFoundAsNull: true });
  }
}

/** Everything that is not a blog post: guides, webinars, research, news. */
export async function getResources(
  type?: Exclude<ResourceType, 'blog'>,
  perPage = 12,
): Promise<ResourcePage> {
  try {
    const { data, meta } = await apiList<ResourceSummary>('resources', {
      tags: [cacheTags.resources],
      query: { per_page: perPage, type },
    });
    return { items: data, meta };
  } catch (error) {
    return rethrowUnlessBuild(error, EMPTY_PAGE);
  }
}

/** One resource, or `null` if unknown. */
export async function getResource(slug: string): Promise<ResourceDetail | null> {
  try {
    return await apiGet<ResourceDetail>(`resources/${slug}`, {
      tags: [cacheTags.resources, cacheTags.resource(slug)],
    });
  } catch (error) {
    return rethrowUnlessBuild(error, null, { notFoundAsNull: true });
  }
}
