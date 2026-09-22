import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServicePillar, getServicePillars } from '@/lib/api/services';
import { ServicePillarTemplate } from '@/templates/ServicePillarTemplate';

type Params = { params: Promise<{ pillar: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ pillar: string }>> {
  const pillars = await getServicePillars();
  return pillars.map((p) => ({ pillar: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { pillar: slug } = await params;
  const pillar = await getServicePillar(slug);
  if (!pillar) return {};

  return {
    title: `${pillar.name} Services & Solutions | TeamBees`,
    description: pillar.description,
    alternates: { canonical: `https://www.teambees.com/services/${pillar.slug}` },
  };
}

export default async function ServicePillarPage({ params }: Params) {
  const { pillar: slug } = await params;
  const pillar = await getServicePillar(slug);

  if (!pillar) notFound();

  return <ServicePillarTemplate pillar={pillar} />;
}
