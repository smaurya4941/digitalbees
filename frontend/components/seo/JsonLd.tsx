import type { SeoBlock } from '@/types/seo';

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Renders JSON-LD structured data. Server component — the script is inlined
 * into the streamed HTML. `data` is trusted (it originates from our own CMS).
 */
export function JsonLd({ data }: JsonLdProps) {
  const graph = Array.isArray(data) ? data : [data];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph.length === 1 ? graph[0] : graph) }}
    />
  );
}

/** Convenience: emit whatever `schema_json` the SEO block carries. */
export function SeoJsonLd({ seo }: { seo: Pick<SeoBlock, 'schema_json'> }) {
  if (!seo.schema_json) return null;
  return <JsonLd data={seo.schema_json} />;
}
