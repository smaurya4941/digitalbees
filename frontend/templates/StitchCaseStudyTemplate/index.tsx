import Link from 'next/link';
import { SeoJsonLd } from '@/components/seo/JsonLd';
import { routes } from '@/config/routes';
import type { CaseStudyDetail, CaseStudySummary } from '@/types/case-study';
import type { Testimonial } from '@/types/testimonial';

import './theme.css';
import { CaseStudyHero } from './components/CaseStudyHero';
import { CaseStudyProofBar } from './components/CaseStudyProofBar';
import { CaseStudyNarrative } from './components/CaseStudyNarrative';
import { CaseStudyProcess } from './components/CaseStudyProcess';
import { CaseStudyResults } from './components/CaseStudyResults';
import { CaseStudyTechStack } from './components/CaseStudyTechStack';
import { CaseStudyTestimonial } from './components/CaseStudyTestimonial';
import { CaseStudyRelated } from './components/CaseStudyRelated';
import { CaseStudyCTA } from './components/CaseStudyCTA';

type StitchCaseStudyTemplateProps = {
  caseStudy: CaseStudyDetail;
  /** Other published case studies, most relevant first. */
  related: CaseStudySummary[];
  /** Published testimonials linked to this case study in the admin. */
  testimonials: Testimonial[];
};

/**
 * The `case-study` template. Every section renders only what the admin
 * entered for this case study; a section with no data is omitted rather
 * than padded with placeholder copy.
 */
export function StitchCaseStudyTemplate({ caseStudy, related, testimonials }: StitchCaseStudyTemplateProps) {
  return (
    <>
      <SeoJsonLd seo={caseStudy.seo} />

      <div className="w-full bg-white border-b border-slate-200 pb-3 pt-[84px] md:pt-[116px] shadow-xs">
        <nav
          aria-label="Breadcrumb"
          className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 font-mono text-xs text-slate-500"
        >
          <Link href={routes.home()} className="hover:text-[#0B1F3A] transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-[14px] text-[#C6963A]" aria-hidden>
            chevron_right
          </span>
          <Link href={routes.caseStudies()} className="hover:text-[#0B1F3A] transition-colors">
            Case Studies
          </Link>
          <span className="material-symbols-outlined text-[14px] text-[#C6963A]" aria-hidden>
            chevron_right
          </span>
          <span className="text-[#0B1F3A] font-semibold truncate max-w-md" aria-current="page">
            {caseStudy.title}
          </span>
        </nav>
      </div>

      <CaseStudyHero caseStudy={caseStudy} />
      <CaseStudyProofBar metrics={caseStudy.metrics} />
      <CaseStudyNarrative caseStudy={caseStudy} />
      <CaseStudyProcess steps={caseStudy.how_it_works} />
      <CaseStudyResults results={caseStudy.results} metrics={caseStudy.metrics} />
      <CaseStudyTechStack technologies={caseStudy.technologies} />
      <CaseStudyTestimonial testimonial={testimonials[0] ?? null} />
      <CaseStudyRelated caseStudies={related} />
      <CaseStudyCTA />
    </>
  );
}
