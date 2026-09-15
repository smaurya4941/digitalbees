import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TechnologyTemplate } from '@/templates/TechnologyTemplate';
import { getTechnologies, getTechnology } from '@/lib/api/technologies';
import { toMetadata } from '@/lib/seo/metadata';

type Params = { params: Promise<{ technology: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ technology: string }>> {
  const technologies = await getTechnologies();
  return technologies.map((t) => ({ technology: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { technology: slug } = await params;
  const technology = await getTechnology(slug);
  if (!technology) return {};
  return toMetadata(technology.seo);
}

export default async function TechnologyPage({ params }: Params) {
  const { technology: slug } = await params;
  const technology = await getTechnology(slug);

  if (!technology) notFound();

  return <TechnologyTemplate technology={technology} />;
}
