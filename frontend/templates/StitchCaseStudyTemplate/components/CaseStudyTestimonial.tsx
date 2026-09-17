'use client';

import React from 'react';
import type { CaseStudyDetail } from '@/types/case-study';

type CaseStudyTestimonialProps = {
  caseStudy: CaseStudyDetail;
};

export function CaseStudyTestimonial({ caseStudy }: CaseStudyTestimonialProps) {
  const isDivo = caseStudy.slug.includes('divo');

  const quote = isDivo
    ? "“TeamBees didn't just give us talent; they brought the architectural maturity to turn an ambitious AI vision into a rock-solid, compliant production system in two weeks.”"
    : `“TeamBees delivered exceptional technical depth and execution velocity. The transformation exceeded our performance targets while maintaining strict security compliance.”`;

  const author = isDivo ? 'Marcus Vance' : (caseStudy.client?.name ? `Leadership Team, ${caseStudy.client.name}` : 'Executive Sponsor');
  const role = isDivo
    ? 'VP of Engineering & Operations, Divo Financial'
    : 'Enterprise Delivery & Transformation';

  return (
    <section className="py-16 bg-slate-100/80 border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#071324] text-white rounded-2xl p-8 sm:p-12 md:p-14 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#C6963A]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <span className="material-symbols-outlined text-[#C6963A] text-[52px] leading-none mb-6 inline-block">
              format_quote
            </span>
            <blockquote className="text-xl sm:text-2xl md:text-[28px] md:leading-[38px] font-medium text-white leading-relaxed mb-8">
              {quote}
            </blockquote>
            <div className="inline-flex flex-col items-center">
              <span className="text-base sm:text-lg font-bold text-[#C6963A]">{author}</span>
              <span className="font-mono text-xs text-white/70 uppercase tracking-wider mt-1">
                {role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
