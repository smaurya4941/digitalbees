'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { CaseStudySummary } from '@/types/case-study';
import { routes } from '@/config/routes';

// Rotating card backgrounds — case studies carry no colour of their own.
const GRADIENTS = [
  'from-[#0B1F3A] to-[#1E3A60]',
  'from-[#132B4F] to-[#254B7C]',
  'from-[#0F2D3A] to-[#1E5268]',
  'from-[#18342B] to-[#2B5A4B]',
];

const VISIBLE_COUNT = 2; // two cards side by side on desktop

/** Headline outcome: the first metric if present, otherwise the summary. */
function outcomeOf(study: CaseStudySummary): string | null {
  const metric = study.metrics?.[0];
  if (metric) return `${metric.value} ${metric.label}`;
  return study.summary;
}

export default function ReniusCaseStudySlider({ caseStudies }: { caseStudies: CaseStudySummary[] }) {
  const [startIndex, setStartIndex] = useState(0);

  if (caseStudies.length === 0) return null;

  const maxIndex = Math.max(0, caseStudies.length - VISIBLE_COUNT);
  const canSlide = maxIndex > 0;

  const handleNext = () => setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const handlePrev = () => setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));

  const currentCards = caseStudies.slice(startIndex, startIndex + VISIBLE_COUNT);

  return (
    <section className="py-20 bg-gradient-to-b from-[#F8FAFD] to-white border-b border-neutral-100 relative overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#CBDFF2]">
              <span className="w-2 h-2 rounded-full bg-[#9E6D18]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E6D18]">
                PROVEN OUTCOMES
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F3A] tracking-tight">
              Real-world transformation, <span className="text-[#9E6D18]">measured in outcomes.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              See how specialist TeamBees pods ship quickly and hold quality steady.
            </p>
          </div>

          {canSlide && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous case study"
                className="w-10 h-10 rounded-xl bg-white border border-[#CBDFF2] text-[#0B1F3A] hover:bg-[#EAF2FB] hover:border-[#C6963A] flex items-center justify-center transition-all shadow-xs"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next case study"
                className="w-10 h-10 rounded-xl bg-white border border-[#CBDFF2] text-[#0B1F3A] hover:bg-[#EAF2FB] hover:border-[#C6963A] flex items-center justify-center transition-all shadow-xs"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Slider Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentCards.map((study, i) => {
            const index = startIndex + i;
            const outcome = outcomeOf(study);

            return (
              <Link
                key={study.slug}
                href={study.href || routes.caseStudy(study.slug)}
                className={`group relative rounded-3xl overflow-hidden p-8 sm:p-10 min-h-[340px] flex flex-col justify-between bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} text-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(11,31,58,0.5)] border border-white/10`}
              >
                {/* Watermark number */}
                <div className="absolute -bottom-6 -right-4 text-[140px] font-black text-white/[0.04] leading-none select-none pointer-events-none">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {study.client_name && (
                  <div className="relative z-10">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold tracking-wider text-white uppercase">
                      {study.client_name}
                    </span>
                  </div>
                )}

                <div className="relative z-10 space-y-4 pt-10">
                  {outcome && (
                    <div className="inline-flex items-start gap-2 px-3 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <p className="text-xs font-mono font-medium tracking-wide line-clamp-2">{outcome}</p>
                    </div>
                  )}

                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-[#D8A74A] transition-colors">
                    {study.title}
                  </h3>

                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
                      Explore Case Study
                    </span>
                    <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-[#0B1F3A] flex items-center justify-center transition-all duration-500 group-hover:-rotate-45">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center pt-12">
          <Link
            href={routes.caseStudies()}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#0B1F3A] text-[#0B1F3A] hover:text-white font-bold text-xs uppercase tracking-wider border border-[#CBDFF2] shadow-xs transition-all"
          >
            <span>View All Case Studies</span>
            <ArrowRight className="h-4 w-4 text-[#9E6D18] group-hover:text-[#D8A74A]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
