'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Award, Sparkles, Check } from 'lucide-react';

const CHECKLIST = [
  'AI-enabled, human-verified selection',
  'Domain validation by TA and industry experts',
  'Flexible engagement models — staff augmentation, capability pods, or hybrid',
  'Enterprise & GCC focus across four active markets',
];

const COUNTERS = [
  { value: '2021', label: 'Established', desc: 'Continuous delivery growth' },
  { value: '50+', label: 'TA & Domain Experts', desc: 'Rigorous 5-gate validation' },
  { value: '20+', label: 'Enterprise Customers', desc: 'Across 6 global regions' },
];

export default function ReniusWhoWeAre() {
  return (
    <section className="py-20 bg-[#F8FAFD] border-b border-[#CBDFF2] relative overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Full-Height Box with Rich Architectural Background Image */}
          <div className="lg:col-span-5 relative flex flex-col">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#CBDFF2]/80 h-full flex flex-col justify-between p-8 sm:p-10 text-white min-h-[520px]">
              {/* Architectural Background Image with Deep Navy Overlay */}
              <Image
                src="/images/hero/hero-slide-1.jpg"
                alt="TeamBees Global Delivery Center"
                fill
                className="object-cover object-center transform scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071527]/98 via-[#0B1F3A]/90 to-[#0B1F3A]/82 z-10" />

              {/* Radial Gold Texture Accent */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(198,150,58,0.25)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40 z-10" />

              {/* Top Content */}
              <div className="relative z-20 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6963A]/25 border border-[#C6963A]/40 text-[#E5B556] font-mono text-xs font-bold shadow-xs">
                  <ShieldCheck className="h-4 w-4 text-[#E5B556]" />
                  <span>THE TEAMBEES STANDARD</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white tracking-tight">
                  Built to solve the gap between staffing agencies and slow consultancies.
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Traditional staffing agencies lack engineering depth, while monolithic consultancies
                  charge excessive markups and take months to mobilize. We provide pre-validated,
                  autonomous delivery pods ready to deploy in days.
                </p>

                {/* Trust Highlights */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <div className="w-4 h-4 rounded-full bg-[#E58A1F] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Five-Gate Domain &amp; Code Rigor</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <div className="w-4 h-4 rounded-full bg-[#E58A1F] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>100% Dedicated Delivery Accountability</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <div className="w-4 h-4 rounded-full bg-[#E58A1F] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>SOC2 Type II &amp; ISO 27001 Certified Pods</span>
                  </div>
                </div>
              </div>

              {/* Bottom Metrics Box (Full Width Inside Left Card) */}
              <div className="relative z-20 pt-6 mt-8 border-t border-white/15">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xs">
                    <div className="text-2xl sm:text-3xl font-black font-mono text-[#E5B556]">48h SLA</div>
                    <div className="text-[11px] text-white/80 font-medium mt-1">Shortlist Turnaround</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xs">
                    <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">100%</div>
                    <div className="text-[11px] text-white/80 font-medium mt-1">Pod Accountability</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                  <span>6 Global Delivery Hubs</span>
                  <span>24/7 Follow-the-Sun</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content + Checklist + Stat Counters + CTA */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FB] border border-[#CBDFF2]">
                <span className="w-2 h-2 rounded-full bg-[#E58A1F]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E6D18]">
                  WHO WE ARE
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-[#0B1F3A] tracking-tight leading-[1.15]">
                Technology talent and capability delivery, <br />
                <span className="text-[#9E6D18]">under one roof.</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                We help enterprise and GCC technology teams put AI to work — agentic workflows,
                intelligent automation, and AI-driven quality engineering, on the platforms they
                already run — delivered by validated specialists embedded in their workflows and
                governance.
              </p>
            </div>

            {/* 4-point Checklist */}
            <div className="space-y-2.5 py-1">
              {CHECKLIST.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#0B1F3A]">{item}</span>
                </div>
              ))}
            </div>

            {/* 3 Stat Counters with Rich Card Shadows */}
            <div className="grid grid-cols-3 gap-3.5 pt-4 border-t border-[#CBDFF2]">
              {COUNTERS.map((c, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(11,31,58,0.06)] hover:shadow-md transition-all"
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-[#0B1F3A]">
                    {c.value}
                  </div>
                  <div className="text-xs font-bold text-[#9E6D18] mt-0.5">{c.label}</div>
                  <div className="text-[11px] text-slate-500 mt-1 hidden sm:block">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D8A74A] to-[#C6963A] text-[#0B1F3A] font-extrabold text-xs uppercase tracking-wider shadow-md shadow-[#C6963A]/20 hover:shadow-lg hover:shadow-[#C6963A]/30 hover:-translate-y-0.5 transition-all"
              >
                <span>More About Us</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
