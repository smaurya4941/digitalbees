import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CombinatorialTemplate } from '@/templates/CombinatorialTemplate';
import { resolvePage, getPages } from '@/lib/api/pages';
import { toMetadata } from '@/lib/seo/metadata';

type Params = { params: Promise<{ region: string; practice: string }> };

// Backstop revalidation; on-demand invalidation comes from /api/revalidate.
export const revalidate = 3600;
// Only curated pairs are pre-rendered; every other pair 404s (no thin pages).
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ region: string; practice: string }>> {
  const pages = await getPages('region-practice');
  return pages
    .map((p) => p.url_path.split('/').filter(Boolean)) // ['regions', '{region}', '{practice}']
    .filter((segments) => segments.length === 3)
    .map(([, region, practice]) => ({ region, practice }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { region, practice } = await params;
  const page = await resolvePage(`/regions/${region}/${practice}`);
  if (!page) return {};
  return toMetadata(page.seo);
}

export default async function RegionPracticePage({ params }: Params) {
  const { region, practice } = await params;
  const page = await resolvePage(`/regions/${region}/${practice}`);

  if (!page) notFound();

  return <CombinatorialTemplate page={page} parentCollection="regions" />;
}
