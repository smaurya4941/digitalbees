/**
 * The SEO block every content resource embeds. Mirrors the `seo_metadata`
 * table on the backend. `lib/seo/metadata.ts` maps this to a Next `Metadata`.
 */
export interface SeoBlock {
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  robots: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  twitter_card: string | null;
  schema_type: string | null;
  /** JSON-LD object(s), rendered verbatim by components/seo/JsonLd. */
  schema_json: Record<string, unknown> | Record<string, unknown>[] | null;
}

export interface Breadcrumb {
  label: string;
  href: string;
}
