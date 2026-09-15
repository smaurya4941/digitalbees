import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { CTABand } from '@/components/sections/CTABand';
import { clientEnv } from '@/config/environment';
import { siteConfig } from '@/config/site';
import { routes } from '@/config/routes';
import type { Breadcrumb } from '@/types/seo';
import type { ResourceDetail } from '@/types/resource';

type ArticleTemplateProps = {
  article: ResourceDetail;
  /** Hub this article belongs to — Insights for blog posts, Resources otherwise. */
  hub: { label: string; href: string };
};

const RESOURCE_TYPE_LABEL: Record<string, string> = {
  blog: 'Insight',
  guide: 'Guide',
  webinar: 'Webinar',
  research: 'Research',
  news: 'News',
};

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.valueOf())
    ? null
    : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Shared article template for `/insights/{slug}` and `/resources/{slug}` —
 * one table, one template, two hubs (IA §1). Emits `Article` JSON-LD, which
 * blueprint §6.3 requires on every insight.
 */
export function ArticleTemplate({ article, hub }: ArticleTemplateProps) {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', href: routes.home() },
    { label: hub.label, href: hub.href },
    { label: article.title, href: article.href },
  ];

  const published = formatDate(article.published_at);
  const kind = RESOURCE_TYPE_LABEL[article.resource_type] ?? 'Insight';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at,
    mainEntityOfPage: new URL(article.href, clientEnv.NEXT_PUBLIC_SITE_URL).toString(),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.legalName,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="bg-canvas py-4">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      </div>

      <Section space="md">
        <article className="max-w-3xl">
          <p className="text-eyebrow uppercase text-ink-muted">{kind}</p>
          <h1 className="mt-3 text-h1 text-ink">{article.title}</h1>

          {(published || article.reading_time_minutes) && (
            <p className="mt-4 text-body-sm text-ink-subtle">
              {published}
              {published && article.reading_time_minutes ? ' · ' : ''}
              {article.reading_time_minutes ? `${article.reading_time_minutes} min read` : ''}
            </p>
          )}

          {article.excerpt && (
            <p className="mt-6 text-body-lg text-ink-muted">{article.excerpt}</p>
          )}

          {article.body && (
            /*
             * CMS-authored HTML. Trusted on the same basis as the JSON-LD
             * payloads: it originates from the RBAC-gated admin, never from
             * public input. If contributions are ever opened up, sanitise here.
             */
            <div
              className="rich-text mt-10"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          )}
        </article>
      </Section>

      <CTABand
        title="Talk to our team"
        description="Tell us the outcome you need. We’ll bring the talent and the technology to get there."
      />
    </>
  );
}
