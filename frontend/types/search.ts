export type SearchResultType =
  | 'practice'
  | 'industry'
  | 'region'
  | 'technology'
  | 'case_study'
  | 'insight'
  | 'resource'
  | 'career';

/** GET /api/v1/search?q=... — one hit. */
export interface SearchHit {
  type: SearchResultType;
  title: string;
  excerpt: string | null;
  url: string;
}
