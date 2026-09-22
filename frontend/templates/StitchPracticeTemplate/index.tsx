import Link from "next/link";
import type { PracticeDetail } from "@/types/practice";
import { routes } from "@/config/routes";
import { SeoJsonLd } from "@/components/seo/JsonLd";
import "./theme.css";

import { PracticeHero } from "./components/PracticeHero";
import { PracticeProofBar } from "./components/PracticeProofBar";
import { PracticeSubNav } from "./components/PracticeSubNav";
import { PracticeServiceGrid } from "./components/PracticeServiceGrid";
import { PracticeCapabilities } from "./components/PracticeCapabilities";
import { PracticeProcess } from "./components/PracticeProcess";
import { PracticeTechStack } from "./components/PracticeTechStack";
import { PracticeCaseStudies } from "./components/PracticeCaseStudies";
import { PracticeRelated } from "./components/PracticeRelated";
import { PracticeFaq } from "./components/PracticeFaq";
import { PracticeCTA } from "./components/PracticeCTA";
import { CtrmSpecialismGrid } from "@/components/practices/CtrmSpecialismGrid";

interface StitchPracticeTemplateProps {
  practice: PracticeDetail;
}

const NAV_ITEMS = [
  { id: "services",      label: "Sub-Services" },
  { id: "capabilities",  label: "Capabilities" },
  { id: "how-we-work",   label: "How We Work" },
  { id: "tech-stack",    label: "Tech Stack" },
  { id: "case-studies",  label: "Case Studies" },
  { id: "related",       label: "Often Paired With" },
  { id: "faq",           label: "FAQ" },
  { id: "consultation",  label: "Get Started" },
];

/**
 * StitchPracticeTemplate — the universal Practice Hub template.
 *
 * Implements the 10-section layout from the Stitch practice-hub-template.html
 * using TeamBees Navy/Gold design tokens. All 7 practices (and any added
 * later) render through this one component via data alone — no slug-specific
 * branching. Layout: breadcrumbs → hero → proof bar → sticky sub-nav rail +
 * main content column → CTA.
 */
export function StitchPracticeTemplate({ practice }: StitchPracticeTemplateProps) {
  return (
    <div className="bg-[#FDFDFD] text-[#0B1F3A] antialiased w-full">
      <SeoJsonLd seo={practice.seo} />

      {/* ---- Breadcrumbs ---- */}
      <div className="w-full bg-[#0B1F3A] border-b border-[#C6963A]/20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12px] text-white/60">
            <Link href={routes.home()} className="hover:text-[#C6963A] transition-colors">
              Home
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link href={routes.practices()} className="hover:text-[#C6963A] transition-colors">
              Practices
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#C6963A] font-semibold">{practice.name}</span>
          </nav>
        </div>
      </div>

      {/* ---- Hero ---- */}
      <PracticeHero practice={practice} />

      {/* ---- Proof Bar ---- */}
      <PracticeProofBar practice={practice} />

      {/* ---- Main layout: sticky sub-nav + content ---- */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-10">
        <div className="flex gap-12 items-start">
          {/* Sticky left rail sub-navigation */}
          <PracticeSubNav items={NAV_ITEMS} practiceName={practice.name} />

          {/* Content column */}
          <div className="flex-1 min-w-0 flex flex-col gap-12">
            {/* Section 3: Sub-service card grid */}
            <PracticeServiceGrid practice={practice} />

            {/* Section 4: Key capabilities (dark navy) */}
            <PracticeCapabilities practice={practice} />

            {/* CTRM & Energy Trading Domain Specialism Grid (Pitch Deck Slide 14) */}
            {practice.slug === 'energy-bees' && <CtrmSpecialismGrid />}

            {/* Section 5: Delivery framework / process */}
            <PracticeProcess practice={practice} />

            {/* Section 6: Tech stack */}
            <PracticeTechStack practice={practice} />

            {/* Section 7: Case studies */}
            <PracticeCaseStudies practice={practice} />

            {/* Section 8: Related practices */}
            <PracticeRelated practice={practice} />

            {/* Section 9: FAQ */}
            <PracticeFaq faqs={practice.faqs} practiceName={practice.name} />

            {/* Section 10: CTA band */}
            <PracticeCTA practice={practice} />
          </div>
        </div>
      </div>
    </div>
  );
}