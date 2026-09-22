'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Users, Code, Bot, TrendingUp, CheckCircle, Terminal, Flame } from 'lucide-react';

const PRACTICES_DATA = [
  {
    name: 'Talent Bees',
    slug: 'talent-bees',
    category: 'IT & Staffing',
    tagline: '48-hour candidate submittal with five validation gates.',
    description: 'Specialist IT, engineering, and executive staffing delivered across US, India, UK, and UAE hubs.',
    icon: Users,
    color: '#2563EB',
    metric: '48h SLA',
  },
  {
    name: 'Digital Bees',
    slug: 'digital-bees',
    category: 'Software & Cloud',
    tagline: 'Cloud-native architecture and product engineering squads.',
    description: 'End-to-end full stack development, cloud migration (AWS/GCP/Azure), and zero-friction DevOps/SRE pipelines.',
    icon: Code,
    color: '#0891B2',
    metric: 'Cloud-Native',
  },
  {
    name: 'AI Bees',
    slug: 'ai-bees',
    category: 'Agents & Swarms',
    tagline: 'Production-governed multi-agent swarms and custom LLM workflows.',
    description: 'Enterprise AI workflows connected to core ERP/CRM backends with verifiable audit trails and evaluation suites.',
    icon: Bot,
    color: '#7C3AED',
    metric: 'Autonomous',
  },
  {
    name: 'ServiceNow Bees',
    slug: 'servicenow-bees',
    category: 'Enterprise SaaS',
    tagline: 'OOTB-first ITSM, ITOM, and CSDM architecture.',
    description: 'Elite ServiceNow certified consultants delivering rapid CMDB cleanup, workflow automation, and enterprise migrations.',
    icon: Terminal,
    color: '#059669',
    metric: '5–7 Day Turnaround',
  },
  {
    name: 'Quality Bees',
    slug: 'quality-bees',
    category: 'Assurance & QA',
    tagline: 'Automated regression pipelines with zero-defect guarantees.',
    description: 'Continuous test automation, performance engineering, mobile QA, and self-healing UI test pipelines.',
    icon: CheckCircle,
    color: '#0D9488',
    metric: 'Zero Defect',
  },
  {
    name: 'Energy Bees',
    slug: 'energy-bees',
    category: 'CTRM Trading',
    tagline: 'Deep commodity trading, risk management, and analytics.',
    description: 'Specialized Openlink Endur, Allegro, and RightAngle technical delivery for global energy and trading desks.',
    icon: Flame,
    color: '#D97706',
    metric: 'Trading Grade',
  },
  {
    name: 'Marketing Bees',
    slug: 'marketing-bees',
    category: 'Growth & Performance',
    tagline: 'Data-driven pipeline generation and CAC/ROAS optimization.',
    description: 'B2B enterprise demand gen, technical SEO, marketing automation, and multi-channel performance growth.',
    icon: TrendingUp,
    color: '#EA580C',
    metric: 'ROAS Focused',
  },
];

const REPEAT_TICKER = [
  'CERTIFIED SERVICENOW RESOURCES',
  'OOTB-FIRST DELIVERY APPROACH',
  'VALIDATED SPECIALISTS ONLY',
  '48-HOUR TALENT SHORTLIST',
  'ENTERPRISE GOVERNED AI AGENTS',
  'GLOBAL DELIVERY HUBS',
];

export default function ReniusPracticesCarousel() {
  const [startIndex, setStartIndex] = useState(0);

  // Show 3 cards on desktop at a time, sliding by 1
  const visibleCardsCount = 3;
  const maxStartIndex = PRACTICES_DATA.length - visibleCardsCount;

  const handleNext = () => {
    setStartIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev <= 0 ? maxStartIndex : prev - 1));
  };

  const visiblePractices = PRACTICES_DATA.slice(startIndex, startIndex + visibleCardsCount);

  return (
    <section className="py-16 bg-[#FAFCFF] relative border-b border-[#CBDFF2]">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Section Header: Compact, clean, no redundant title paragraphs */}
        <div className="flex items-end justify-between mb-8 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FB] border border-[#CBDFF2]">
              <span className="w-2 h-2 rounded-full bg-[#E58A1F]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E6D18]">
                WHAT WE OFFER
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F3A] tracking-tight">
              Specialized Delivery Practices
            </h2>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous practice"
              className="w-10 h-10 rounded-xl bg-white border border-[#CBDFF2] text-[#0B1F3A] hover:bg-[#EAF2FB] hover:border-[#C6963A] flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next practice"
              className="w-10 h-10 rounded-xl bg-white border border-[#CBDFF2] text-[#0B1F3A] hover:bg-[#EAF2FB] hover:border-[#C6963A] flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carousel Grid (3 visible on desktop) with Rich Drop Shadows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
          {visiblePractices.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.slug}
                className="rounded-3xl bg-white border border-slate-200/90 hover:border-[#C6963A]/70 shadow-[0_10px_30px_rgba(11,31,58,0.07)] hover:shadow-[0_20px_45px_rgba(11,31,58,0.13)] hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Row: Colored Icon Box + Metric Pill */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs"
                      style={{ backgroundColor: `${p.color}15`, color: p.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200 group-hover:border-[#C6963A]/50 transition-colors">
                      {p.metric}
                    </span>
                  </div>

                  {/* Category Tag */}
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9E6D18] block mb-1">
                    {p.category}
                  </span>

                  {/* Practice Name */}
                  <h3 className="text-xl font-bold text-[#0B1F3A] mb-2 group-hover:text-[#9E6D18] transition-colors">
                    {p.name}
                  </h3>

                  {/* Tagline */}
                  <p className="text-xs font-semibold text-[#0B1F3A]/90 leading-snug mb-2">
                    {p.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {p.description}
                  </p>
                </div>

                {/* Bottom Link */}
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/practices/${p.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#9E6D18] hover:text-[#0B1F3A] transition-colors group/link"
                  >
                    <span>Read More</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CBDFF2] group-hover:bg-[#C6963A] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust-Badge Ticker Strip directly beneath Carousel */}
      <div className="w-full bg-[#0B1F3A] text-white py-3 overflow-hidden border-t border-b border-[#0B1F3A]/20 mt-12">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex items-center shrink-0">
              {REPEAT_TICKER.map((text, idx) => (
                <div key={idx} className="flex items-center mx-6">
                  <span className="font-mono text-xs font-bold tracking-widest uppercase text-white/90">
                    {text}
                  </span>
                  <span className="ml-6 text-[#E58A1F] text-xs font-bold">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
