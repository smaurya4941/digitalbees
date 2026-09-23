import 'server-only';
import type { BlogCategory, BlogPost, BlogPostDetail } from '@/types/resource';
import { ApiError, apiGet, apiList } from './client';
import { cacheTags } from './tags';
import { rethrowUnlessBuild } from './build-fallback';

export interface BlogPostQuery {
  category?: string;
  tag?: string;
  q?: string;
  featured?: boolean;
  page?: number;
  perPage?: number;
}

export interface BlogPostPage {
  items: BlogPost[];
  page: number;
  lastPage: number;
  total: number;
}

const EMPTY: BlogPostPage = { items: [], page: 1, lastPage: 1, total: 0 };

/**
 * Published posts, newest first. Every blog read carries the `insights` tag,
 * which the backend purges on any post or category change.
 */
export async function getBlogPosts(query: BlogPostQuery = {}): Promise<BlogPostPage> {
  try {
    const { data, meta } = await apiList<BlogPost>('blog/posts', {
      tags: [cacheTags.insights],
      query: {
        category: query.category,
        tag: query.tag,
        q: query.q,
        featured: query.featured === undefined ? undefined : query.featured ? 1 : 0,
        page: query.page && query.page > 1 ? query.page : undefined,
        per_page: query.perPage,
      },
    });

    return {
      items: data ?? [],
      page: Number(meta.current_page ?? 1),
      lastPage: Number(meta.last_page ?? 1),
      total: Number(meta.total ?? data?.length ?? 0),
    };
  } catch (error) {
    // A malformed filter (e.g. an over-long ?q=) is a 422: show no results, not an error page.
    if (error instanceof ApiError && error.status === 422) return EMPTY;
    return rethrowUnlessBuild(error, EMPTY);
  }
}

/** One published post with body, table of contents and related posts, or `null`. */
export async function getBlogPost(slug: string): Promise<BlogPostDetail | null> {
  try {
    return await apiGet<BlogPostDetail>(`blog/posts/${encodeURIComponent(slug)}`, {
      tags: [cacheTags.insights, cacheTags.resource(slug)],
    });
  } catch (error) {
    return rethrowUnlessBuild(error, null, { notFoundAsNull: true });
  }
}

/** All categories (admin-ordered) with their published post counts. */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const { data } = await apiList<BlogCategory>('blog/categories', { tags: [cacheTags.insights] });
    return data ?? [];
  } catch (error) {
    return rethrowUnlessBuild(error, []);
  }
}
