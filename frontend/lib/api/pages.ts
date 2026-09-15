import 'server-only';
import type { PageListItem, ResolvedPage } from '@/types/page';
import { apiGet, apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';

/**
 * Resolve an arbitrary published path — curated combinatorial pages
 * (industry-practice, region-practice) and simple CMS pages alike. Returns
 * `null` for anything not published, which callers turn into a real 404
 * (IA doc §5 rule 4: non-curated combinations must never render a thin page).
 */
export async function resolvePage(path: string): Promise<ResolvedPage | null> {
  try {
    return await apiGet<ResolvedPage>('pages/resolve', {
      query: { path },
      tags: [cacheTags.page(path)],
    });
  } catch (error) {
    return rethrowUnlessBuild(error, null, { notFoundAsNull: true });
  }
}

/** Published pages, optionally filtered by template — used by the sitemap. */
export async function getPages(templateKey?: string): Promise<PageListItem[]> {
  try {
    const { data } = await apiList<PageListItem>('pages', {
      query: templateKey ? { template_key: templateKey } : undefined,
      tags: [cacheTags.pages],
    });
    return data;
  } catch (error) {
    return rethrowUnlessBuild(error, [] as PageListItem[]);
  }
}
