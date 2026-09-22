'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Shield } from 'lucide-react';

const QUOTES = [
  {
    quote:
      'Teams recovered 45–60 minutes per person, per day through governed multi-agent finance workflow automation connecting our transaction ledgers.',
    author: 'Enterprise Finance Team',
    role: 'Financial Services Leader',
    badge: 'Finance & Banking',
    impact: '45–60 mins/day saved',
  },
  {
    quote:
      'Delivered 10-domain HRMS modernization with automated onboarding, dynamic credentialing, and real-time compliance reporting in under 12 weeks.',
    author: 'VP People Systems',
    role: 'Enterprise SaaS Client',
    badge: 'HR & SaaS',
    impact: '10 Domains Modernized',
  },
  {
    quote:
      'Reduced regression testing cycles by 65% with self-healing UI test automation across our continuous production release pipeline.',
    author: 'Head of Quality Engineering',
    role: 'Global Technology Brand',
    badge: 'Enterprise Software',
    impact: '65% Faster Release Cycles',
  },
  {
    quote:
      'Standardized enterprise CMDB and CSDM architecture across complex transit infrastructure within 90 days with zero operational downtime.',
    author: 'Director of Service Operations',
    role: 'Transport & Infrastructure Client',
    badge: 'ServiceNow & ITSM',
    impact: '90-Day Full CMDB Cleanup',
  },
];

export default function ReniusProofValidation() {
  const [activeQuote, setActiveQuote] = useState(0);

  const handleNext = () => {
    setActiveQuote((prev) => (prev + 1) % QUOTES.length);
  };

  const handlePrev = () => {
    setActiveQuote((prev) => (prev - 1 + QUOTES.length) % QUOTES.length);
  };

  const q = QUOTES[activeQuote];

  return (
    <section className="py-16 bg-white border-b border-[#CBDFF2] relative">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Tier 1: Verified Enterprise Track Record Banner (Aligned Width) */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#EAF2FB] via-[#F4F8FC] to-white border border-[#CBDFF2] shadow-[0_8px_25px_rgba(11,31,58,0.06)] mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#CBDFF2] text-xs font-mono font-bold text-[#9E6D18] shadow-2xs">
              <Shield className="h-3.5 w-3.5 text-[#C6963A]" />
              <span>VERIFIED ENTERPRISE TRACK RECORD</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0B1F3A] tracking-tight">
              20+ Enterprise Customers Across Regulated Verticals
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Serving manufacturing, healthcare, BFSI, technology, and energy trading sectors
              operating in North America, Europe, MENA, and APAC.
            </p>
          </div>

          {/* Right Stat Cards */}
          <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-start md:justify-end">
            <div className="text-center px-5 py-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs min-w-[120px]">
              <div className="text-2xl font-black font-mono text-[#0B1F3A]">99.9%</div>
              <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Delivery Precision</div>
            </div>
            <div className="text-center px-5 py-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs min-w-[120px]">
              <div className="text-2xl font-black font-mono text-[#9E6D18]">48h</div>
              <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Typical Shortlist</div>
            </div>
          </div>
        </div>

        {/* Tier 2: Quote Carousel (Consistent Container Width & Rich Shadow) */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-10 relative shadow-[0_12px_35px_rgba(11,31,58,0.08)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            {/* Quote Icon */}
            <div className="w-11 h-11 rounded-2xl bg-[#EAF2FB] text-[#9E6D18] flex items-center justify-center border border-[#CBDFF2] shadow-2xs">
              <Quote className="h-5 w-5 fill-[#9E6D18]/20" />
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500 font-bold tracking-wider">
                Outcome {activeQuote + 1} of {QUOTES.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous quote"
                  className="w-9 h-9 rounded-xl bg-[#F8FAFD] hover:bg-white border border-[#CBDFF2] hover:border-[#C6963A] text-[#0B1F3A] flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next quote"
                  className="w-9 h-9 rounded-xl bg-[#F8FAFD] hover:bg-white border border-[#CBDFF2] hover:border-[#C6963A] text-[#0B1F3A] flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Blockquote */}
          <blockquote className="text-lg sm:text-xl md:text-2xl font-bold text-[#0B1F3A] leading-relaxed mb-8">
            &ldquo;{q.quote}&rdquo;
          </blockquote>

          {/* Author Bar */}
          <div className="flex flex-wrap items-center justify-between pt-5 border-t border-slate-100 gap-4">
            <div>
              <div className="font-extrabold text-[#0B1F3A] text-sm sm:text-base">{q.author}</div>
              <div className="text-xs text-slate-500 font-medium">{q.role}</div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#C6963A]/15 text-[#9E6D18] border border-[#C6963A]/30">
                {q.impact}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                {q.badge}
              </span>
            </div>
          </div>

          {/* Slide Dots Indicator */}
          <div className="flex justify-center gap-1.5 pt-6">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveQuote(i)}
                aria-label={`Go to outcome ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeQuote ? 'w-6 bg-[#C6963A]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
