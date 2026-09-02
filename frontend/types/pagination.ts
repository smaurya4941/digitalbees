/** Matches the `{ data, meta, links }` envelope from App\Support\Http\ApiResponse. */
export interface ApiEnvelope<T> {
  data: T;
  meta: EnvelopeMeta;
  links?: EnvelopeLinks;
}

export interface EnvelopeMeta {
  count?: number | null;
  per_page?: number;
  has_more?: boolean;
  /** present on stubbed endpoints during buildout */
  stub?: boolean;
  todo?: string;
  [key: string]: unknown;
}

export interface EnvelopeLinks {
  next?: string | null;
  prev?: string | null;
}

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
  prevCursor: string | null;
}
