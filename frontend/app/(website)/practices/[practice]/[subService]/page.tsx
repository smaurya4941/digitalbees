import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SubServiceTemplate } from '@/templates/SubServiceTemplate';
import { getPractice, getPractices, getSubService } from '@/lib/api/practices';
import { toMetadata } from '@/lib/seo/metadata';

type Params = { params: Promise<{ practice: string; subService: string }> };

// Backstop revalidation; on-demand invalidation comes from /api/revalidate.
export const revalidate = 3600;
// Render known sub-services at build; unknown slugs 404 (no thin doorway pages).
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ practice: string; subService: string }>> {
  const practices = await getPractices();
  const details = await Promise.all(practices.map((p) => getPractice(p.slug)));

  return details.flatMap((practice) =>
    practice ? practice.services.map((service) => ({ practice: practice.slug, subService: service.slug })) : [],
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { practice, subService } = await params;
  const detail = await getSubService(practice, subService);
  if (!detail) return {};
  return toMetadata(detail.seo);
}

export default async function SubServicePage({ params }: Params) {
  const { practice, subService: subServiceSlug } = await params;
  const subService = await getSubService(practice, subServiceSlug);

  if (!subService) notFound();

  return <SubServiceTemplate subService={subService} />;
}
