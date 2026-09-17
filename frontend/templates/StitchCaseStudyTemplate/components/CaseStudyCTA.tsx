'use client';

import React from 'react';
import Link from 'next/link';
import { routes } from '@/config/routes';

export function CaseStudyCTA() {
  return (
    <section className="relative py-24 bg-[#0B1F3A] text-white overflow-hidden border-t border-white/10" id="consultation">
      {/* Background Grid & Ambient Glow */}
      <div className="absolute inset-0 case-study-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C6963A]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span className="font-mono text-xs text-[#C6963A] uppercase tracking-widest block font-bold mb-3">
          Enterprise Acceleration
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-white tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
          Ready to achieve similar outcomes for your enterprise?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Our principal solution architects partner with your senior engineering and business teams
          to scope, prototype, and deliver production-grade AI agents in weeks.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={routes.contact()}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#C6963A] text-[#071324] font-bold text-base shadow-[0_4px_20px_rgba(198,150,58,0.35)] hover:bg-[#C6963A]/90 hover:-translate-y-0.5 transition-all duration-200"
          >
            Book an Architecture Consultation
          </Link>
          <Link
            href={routes.caseStudies()}
            className="w-full sm:w-auto px-8 py-4 rounded-lg border border-white/30 text-white font-semibold text-base hover:bg-white/10 hover:border-white transition-all duration-200"
          >
            Explore All Case Studies
          </Link>
        </div>
      </div>
    </section>
  );
}
