'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';

const CASE_STUDIES = [
  {
    num: '01',
    title: 'Divo — Multi-agent AI for Finance + CRM',
    tag: 'AI Bees',
    category: 'FinTech & Banking',
    outcome: '40% acceleration in cross-ledger transaction audits',
    href: '/case-studies',
    bgGradient: 'from-[#0B1F3A] to-[#1E3A60]',
  },
  {
    num: '02',
    title: 'HRMS — AI workforce platform across 10 domains',
    tag: 'AI Bees',
    category: 'Enterprise SaaS',
    outcome: 'Automated onboarding workflows with real-time compliance reporting',
    href: '/case-studies',
    bgGradient: 'from-[#132B4F] to-[#254B7C]',
  },
  {
    num: '03',
    title: 'Testbot — Self-healing UI tests & continuous regression',
    tag: 'Quality Bees',
    category: 'Automated QA',
    outcome: 'Reduced regression testing cycle times by 65%',
    href: '/case-studies',
    bgGradient: 'from-[#0F2D3A] to-[#1E5268]',
  },
  {
    num: '04',
    title: 'National Rail — CSDM/CMDB modernization & ITOM rollout',
    tag: 'ServiceNow Bees',
    category: 'Transport & Infrastructure',
    outcome: 'Zero downtime cutover across multi-region transit infrastructure',
    href: '/case-studies',
    bgGradient: 'from-[#18342B] to-[#2B5A4B]',
  },
];

export default function ReniusCaseStudySlider() {
  const [startIndex, setStartIndex] = useState(0);

  const visibleCount = 2; // Show 2 featured cards side by side on desktop
  const maxIndex = CASE_STUDIES.length - visibleCount;

  const handleNext = () => {
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const currentCards = CASE_STUDIES.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="py-20 bg-[#F8FAFD] border-b border-[#CBDFF2] relative">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FB] border border-[#CBDFF2]">
              <span className="w-2 h-2 rounded-full bg-[#9E6D18]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E6D18]">
                OUR CASE STUDIES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1F3A] tracking-tight">
              Real-world transformation, <br />
              <span className="text-[#9E6D18]">measured in outcomes.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl">
              From agentic finance pipelines to nationwide transit CMDB overhauls, explore how
              specialized TeamBees pods deliver velocity with zero defect tolerance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous case study"
              className="w-11 h-11 rounded-xl bg-white border border-[#CBDFF2] text-[#0B1F3A] hover:bg-[#EAF2FB] hover:border-[#C6963A] flex items-center justify-center transition shadow-xs"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next case study"
              className="w-11 h-11 rounded-xl bg-white border border-[#CBDFF2] text-[#0B1F3A] hover:bg-[#EAF2FB] hover:border-[#C6963A] flex items-center justify-center transition shadow-xs"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Numbered Slider Cards (Renius Project Format) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {currentCards.map((study) => (
            <Link
              key={study.num}
              href={study.href}
              className={`group relative rounded-3xl overflow-hidden p-8 sm:p-10 min-h-[380px] flex flex-col justify-between bg-gradient-to-br ${study.bgGradient} text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl border border-white/10`}
            >
              {/* Background ambient pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />

              {/* Top Bar: Number + Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono text-3xl sm:text-4xl font-black text-white/30 group-hover:text-[#D8A74A] transition-colors">
                  {study.num}
                </span>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-mono font-bold text-[#D8A74A]">
                    {study.tag}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-white/70 font-mono">
                    {study.category}
                  </span>
                </div>
              </div>

              {/* Bottom: Title, Outcome & Arrow */}
              <div className="relative z-10 space-y-3 pt-12">
                <p className="text-xs font-mono font-semibold text-emerald-400">
                  // {study.outcome}
                </p>

                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#D8A74A] transition leading-snug">
                  {study.title}
                </h3>

                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/80 group-hover:text-white transition">
                    Explore Case Study
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white/10 text-white group-hover:bg-[#C6963A] group-hover:text-[#0B1F3A] flex items-center justify-center transition-all">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Case Studies Button */}
        <div className="text-center pt-10">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#0B1F3A] font-bold text-xs uppercase tracking-wider border border-[#CBDFF2] shadow-xs transition-all"
          >
            <span>View All Enterprise Case Studies</span>
            <ArrowRight className="h-4 w-4 text-[#9E6D18]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
