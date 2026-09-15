import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RegionTemplate } from '@/templates/RegionTemplate';
import { getRegion, getRegions } from '@/lib/api/regions';
import { toMetadata } from '@/lib/seo/metadata';

type Params = { params: Promise<{ region: string }> };

// Backstop revalidation; on-demand invalidation comes from /api/revalidate.
export const revalidate = 3600;
// Render known regions at build; unknown slugs 404 (no thin doorway pages).
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ region: string }>> {
  const regions = await getRegions();
  return regions.map((r) => ({ region: r.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { region: slug } = await params;
  const region = await getRegion(slug);
  if (!region) return {};
  return toMetadata(region.seo);
}

export default async function RegionPage({ params }: Params) {
  const { region: slug } = await params;
  const region = await getRegion(slug);

  if (!region) notFound();

  return <RegionTemplate region={region} />;
}
