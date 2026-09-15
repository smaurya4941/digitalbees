import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleTemplate } from '@/templates/ArticleTemplate';
import { getResource, getResources } from '@/lib/api/resources';
import { entityMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const { items } = await getResources(undefined, 100);
  return items.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResource(slug);
  if (!resource) return {};

  return entityMetadata({
    title: resource.title,
    description: resource.excerpt,
    path: routes.resource(resource.slug),
    siteUrl: siteConfig.url,
    type: 'article',
    publishedTime: resource.published_at,
  });
}

export default async function ResourcePage({ params }: Params) {
  const { slug } = await params;
  const resource = await getResource(slug);

  if (!resource) notFound();

  return (
    <ArticleTemplate
      article={resource}
      hub={{ label: 'Resources', href: routes.resources() }}
    />
  );
}
