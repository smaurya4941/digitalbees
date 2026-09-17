import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StitchCaseStudyTemplate } from '@/templates/StitchCaseStudyTemplate';
import { getCaseStudies, getCaseStudy } from '@/lib/api/case-studies';
import { toMetadata } from '@/lib/seo/metadata';

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);
  if (!caseStudy) return {};
  return toMetadata(caseStudy.seo);
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) notFound();

  return <StitchCaseStudyTemplate caseStudy={caseStudy} />;
}

