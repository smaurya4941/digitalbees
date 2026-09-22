import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getServicePillar,
  getServicePillars,
  getServiceClusterPage,
  getServiceClusterPages,
} from '@/lib/api/services';
import { ServiceClusterTemplate } from '@/templates/ServiceClusterTemplate';

type Params = { params: Promise<{ pillar: string; slug: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ pillar: string; slug: string }>> {
  const pillars = await getServicePillars();
  const pairs: Array<{ pillar: string; slug: string }> = [];

  for (const pillar of pillars) {
    const clusters = await getServiceClusterPages(pillar.slug);
    for (const cluster of clusters) {
      pairs.push({ pillar: pillar.slug, slug: cluster.slug });
    }
  }

  return pairs;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { pillar: pillarSlug, slug } = await params;
  const page = await getServiceClusterPage(pillarSlug, slug);
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `https://www.teambees.com/services/${pillarSlug}/${slug}`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://www.teambees.com/services/${pillarSlug}/${slug}`,
      type: 'website',
    },
  };
}

export default async function ServiceClusterPageRoute({ params }: Params) {
  const { pillar: pillarSlug, slug } = await params;
  const [pillar, page] = await Promise.all([
    getServicePillar(pillarSlug),
    getServiceClusterPage(pillarSlug, slug),
  ]);

  if (!pillar || !page) notFound();

  return <ServiceClusterTemplate page={page} pillarName={pillar.name} />;
}
