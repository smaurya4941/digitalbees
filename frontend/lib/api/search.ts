import 'server-only';
import type { SearchHit } from '@/types/search';
import { apiList } from './client';

/**
 * Server-side search for the `/search` results page. Always fresh — a search
 * query is user input, never cached like content pages are.
 */
export async function search(query: string, type?: string): Promise<SearchHit[]> {
  if (query.trim().length < 2) return [];

  const { data } = await apiList<SearchHit>('search', {
    query: { q: query, type },
    revalidate: false,
  });

  return data;
}
