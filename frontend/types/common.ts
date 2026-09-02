export type Status = 'draft' | 'published' | 'archived';

export interface Timestamped {
  created_at: string | null;
  updated_at: string | null;
}

export interface ImageRef {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
}

/** Next 15+ delivers route params and searchParams as promises. */
export type RouteParams<T> = { params: Promise<T> };
export type RouteSearchParams = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
