import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CombinatorialTemplate } from '@/templates/CombinatorialTemplate';
import { resolvePage, getPages } from '@/lib/api/pages';
import { toMetadata } from '@/lib/seo/metadata';

type Params = { params: Promise<{ industry: string; practice: string }> };

// Backstop revalidation; on-demand invalidation comes from /api/revalidate.
export const revalidate = 3600;
// Only curated pairs are pre-rendered; every other pair 404s (no thin pages).
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ industry: string; practice: string }>> {
  const pages = await getPages('industry-practice');
  return pages
    .map((p) => p.url_path.split('/').filter(Boolean)) // ['industries', '{industry}', '{practice}']
    .filter((segments) => segments.length === 3)
    .map(([, industry, practice]) => ({ industry, practice }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { industry, practice } = await params;
  const page = await resolvePage(`/industries/${industry}/${practice}`);
  if (!page) return {};
  return toMetadata(page.seo);
}

export default async function IndustryPracticePage({ params }: Params) {
  const { industry, practice } = await params;
  const page = await resolvePage(`/industries/${industry}/${practice}`);

  if (!page) notFound();

  return <CombinatorialTemplate page={page} parentCollection="industries" />;
}
