'use client';

import React from 'react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import type { CaseStudyDetail } from '@/types/case-study';

type CaseStudyHeroProps = {
  caseStudy: CaseStudyDetail;
};

export function CaseStudyHero({ caseStudy }: CaseStudyHeroProps) {
  const industryName = caseStudy.industries?.[0]?.name?.toUpperCase() || 'ENTERPRISE TECH';
  const industrySlug = caseStudy.industries?.[0]?.slug;
  const primaryPracticeSlug = caseStudy.practices?.[0]?.slug || 'ai-bees';
  const practicesName = caseStudy.practices?.length
    ? caseStudy.practices.map((p) => p.name).join(' & ').toUpperCase()
    : 'AI BEES & DIGITAL BEES';

  const clientName = caseStudy.client?.name || 'Enterprise Leader';
  const regionNames = caseStudy.regions?.length
    ? caseStudy.regions.map((r) => r.name).join(' & ')
    : 'USA & India';
  const servicesList = caseStudy.capabilities_used?.length
    ? caseStudy.capabilities_used.slice(0, 3).join(', ')
    : 'System Architecture, AI Swarms, Integration';

  return (
    <section className="relative bg-[#0B1F3A] text-white pt-14 pb-20 overflow-hidden border-b border-white/10">
      {/* Background Grid & Ambient Glow */}
      <div className="absolute inset-0 case-study-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C6963A]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#C6963A]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Link
            href={industrySlug ? routes.industry(industrySlug) : routes.industries()}
            className="px-3.5 py-1 rounded-full bg-white/10 border border-white/20 hover:border-white/40 font-mono text-xs text-white tracking-wide uppercase font-semibold transition-colors"
          >
            {industryName}
          </Link>
          <Link
            href={routes.practice(primaryPracticeSlug)}
            className="px-3.5 py-1 rounded-full bg-[#C6963A]/20 border border-[#C6963A]/40 hover:border-[#C6963A] font-mono text-xs text-[#C6963A] tracking-wide uppercase font-semibold flex items-center gap-2 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#C6963A] animate-pulse" />
            {practicesName}
          </Link>
        </div>


        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[62px] text-white font-bold tracking-tight max-w-4xl mb-6">
          {caseStudy.slug.includes('divo') ? (
            <>
              40% faster task execution,{' '}
              <span className="text-[#C6963A]">45–60 minutes saved</span> per user per day.
            </>
          ) : (
            caseStudy.title
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/80 max-w-3xl mb-10 leading-relaxed">
          {caseStudy.summary ||
            caseStudy.hero?.description ||
            'How TeamBees engineered an enterprise multi-agent workflow connecting core ledger systems and CRM pipelines into an autonomous loop with deterministic auditability and zero data leakage.'}
        </p>

        {/* 5-Item Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-5 md:p-6 rounded-xl bg-[#071324]/80 border border-white/10 backdrop-blur-md shadow-2xl">
          <div>
            <span className="block font-mono text-[11px] text-white/50 uppercase tracking-wider mb-1">
              Client
            </span>
            <span className="text-sm md:text-base text-white font-semibold block truncate">
              {clientName}
            </span>
          </div>

          <div>
            <span className="block font-mono text-[11px] text-white/50 uppercase tracking-wider mb-1">
              Timeline
            </span>
            <span className="text-sm md:text-base text-[#C6963A] font-semibold block truncate">
              14 Days to Production
            </span>
          </div>

          <div>
            <span className="block font-mono text-[11px] text-white/50 uppercase tracking-wider mb-1">
              Practice
            </span>
            <Link
              href={routes.practice(primaryPracticeSlug)}
              className="text-sm md:text-base text-white hover:text-[#C6963A] font-semibold block truncate transition-colors"
            >
              {practicesName}
            </Link>
          </div>


          <div>
            <span className="block font-mono text-[11px] text-white/50 uppercase tracking-wider mb-1">
              Services
            </span>
            <span className="text-sm md:text-base text-white font-semibold block truncate">
              {servicesList}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="block font-mono text-[11px] text-white/50 uppercase tracking-wider mb-1">
              Region
            </span>
            <span className="text-sm md:text-base text-white font-semibold block truncate">
              {regionNames}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
