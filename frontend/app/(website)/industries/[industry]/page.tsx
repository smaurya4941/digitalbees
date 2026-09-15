import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IndustryTemplate } from '@/templates/IndustryTemplate';
import { getIndustries, getIndustry } from '@/lib/api/industries';
import { toMetadata } from '@/lib/seo/metadata';

type Params = { params: Promise<{ industry: string }> };

// Backstop revalidation; on-demand invalidation comes from /api/revalidate.
export const revalidate = 3600;
// Render known industries at build; unknown slugs 404 (no thin doorway pages).
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ industry: string }>> {
  const industries = await getIndustries();
  return industries.map((i) => ({ industry: i.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { industry: slug } = await params;
  const industry = await getIndustry(slug);
  if (!industry) return {};
  return toMetadata(industry.seo);
}

export default async function IndustryPage({ params }: Params) {
  const { industry: slug } = await params;
  const industry = await getIndustry(slug);

  if (!industry) notFound();

  return <IndustryTemplate industry={industry} />;
}
