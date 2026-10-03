import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StitchCaseStudyTemplate } from '@/templates/StitchCaseStudyTemplate';
import { getCaseStudies, getCaseStudy } from '@/lib/api/case-studies';
import { getTestimonials } from '@/lib/api/testimonials';
import { toMetadata } from '@/lib/seo/metadata';

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

/** `related_type` a testimonial carries when an admin attaches it to a case study. */
const CASE_STUDY_TESTIMONIAL_TYPE = 'case_study';

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

  const [all, testimonials] = await Promise.all([
    getCaseStudies(),
    getTestimonials(CASE_STUDY_TESTIMONIAL_TYPE, caseStudy.id),
  ]);
  const related = all.filter((c) => c.slug !== caseStudy.slug).slice(0, 3);

  return <StitchCaseStudyTemplate caseStudy={caseStudy} related={related} testimonials={testimonials} />;
}
