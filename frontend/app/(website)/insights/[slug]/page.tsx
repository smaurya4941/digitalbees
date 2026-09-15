import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleTemplate } from '@/templates/ArticleTemplate';
import { getInsight, getInsights } from '@/lib/api/resources';
import { entityMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const { items } = await getInsights(100);
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) return {};

  return entityMetadata({
    title: insight.title,
    description: insight.excerpt,
    path: routes.insight(insight.slug),
    siteUrl: siteConfig.url,
    type: 'article',
    publishedTime: insight.published_at,
  });
}

export default async function InsightPage({ params }: Params) {
  const { slug } = await params;
  const insight = await getInsight(slug);

  if (!insight) notFound();

  return (
    <ArticleTemplate
      article={insight}
      hub={{ label: 'Insights', href: routes.insights() }}
    />
  );
}
