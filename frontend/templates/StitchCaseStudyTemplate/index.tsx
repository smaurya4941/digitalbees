'use client';

import React from 'react';
import Link from 'next/link';
import { SeoJsonLd } from '@/components/seo/JsonLd';
import { routes } from '@/config/routes';
import type { CaseStudyDetail } from '@/types/case-study';

import './theme.css';
import { CaseStudyHero } from './components/CaseStudyHero';
import { CaseStudyProofBar } from './components/CaseStudyProofBar';
import { CaseStudyChallenge } from './components/CaseStudyChallenge';
import { CaseStudyTopology } from './components/CaseStudyTopology';
import { CaseStudyProcess } from './components/CaseStudyProcess';
import { CaseStudyTelemetry } from './components/CaseStudyTelemetry';
import { CaseStudyTechStack } from './components/CaseStudyTechStack';
import { CaseStudyImpact } from './components/CaseStudyImpact';
import { CaseStudyTestimonial } from './components/CaseStudyTestimonial';
import { CaseStudyRelated } from './components/CaseStudyRelated';
import { CaseStudyCTA } from './components/CaseStudyCTA';

type StitchCaseStudyTemplateProps = {
  caseStudy: CaseStudyDetail;
};

export function StitchCaseStudyTemplate({ caseStudy }: StitchCaseStudyTemplateProps) {
  return (
    <>
      <SeoJsonLd seo={caseStudy.seo} />

      {/* Breadcrumbs Sub-bar */}
      <div className="w-full bg-white border-b border-slate-200 py-3 shadow-xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 font-mono text-xs text-slate-500">
          <Link href={routes.home()} className="hover:text-[#0B1F3A] transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-[14px] text-[#C6963A]">chevron_right</span>
          <Link href={routes.caseStudies()} className="hover:text-[#0B1F3A] transition-colors">
            Case Studies
          </Link>
          <span className="material-symbols-outlined text-[14px] text-[#C6963A]">chevron_right</span>
          <span className="text-[#0B1F3A] font-semibold truncate max-w-md">
            {caseStudy.slug.includes('divo')
              ? 'Divo Multi-Agent CRM Orchestration'
              : caseStudy.title}
          </span>
        </div>
      </div>

      {/* 1. Hero Section */}
      <CaseStudyHero caseStudy={caseStudy} />

      {/* 2. Impact Proof Bar Ribbon */}
      <CaseStudyProofBar metrics={caseStudy.metrics} />

      {/* 3. The Challenge Section */}
      <CaseStudyChallenge caseStudy={caseStudy} />

      {/* 4. Architecture & Topology Section */}
      <CaseStudyTopology caseStudy={caseStudy} />

      {/* 5. 4-Step Delivery Framework */}
      <CaseStudyProcess steps={caseStudy.how_it_works} />

      {/* 6. Solution Deep-Dive & Live Telemetry Terminal */}
      <CaseStudyTelemetry caseStudy={caseStudy} />

      {/* 7. Technology Stack Strip */}
      <CaseStudyTechStack technologies={caseStudy.technologies} />

      {/* 8. Quantitative Business Results */}
      <CaseStudyImpact caseStudy={caseStudy} />

      {/* 9. Executive Client Testimonial */}
      <CaseStudyTestimonial caseStudy={caseStudy} />

      {/* 10. Related Case Studies Grid */}
      <CaseStudyRelated />

      {/* 11. Final Full-Width Conversion CTA Band */}
      <CaseStudyCTA />
    </>
  );
}
