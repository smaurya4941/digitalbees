/** Normalises the blog listing's `?q=&tag=&page=` search params. */
export function readListingParams(raw: { q?: string | string[]; tag?: string | string[]; page?: string | string[] }) {
  const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  const page = Number.parseInt(first(raw.page) ?? '1', 10);

  return {
    q: first(raw.q)?.slice(0, 100),
    tag: first(raw.tag)?.slice(0, 40),
    page: Number.isFinite(page) && page > 0 ? Math.min(page, 10_000) : 1,
  };
}

export type ListingSearchParams = Promise<{ q?: string | string[]; tag?: string | string[]; page?: string | string[] }>;

/** Settings-driven page size, clamped to what the API accepts. */
export function postsPerPage(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 3 ? Math.min(Math.floor(n), 48) : 9;
}
