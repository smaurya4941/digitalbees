import React from 'react';
import Link from 'next/link';
import type { PracticeDetail } from '@/types/practice';

interface Props {
  practice: PracticeDetail;
}

export function AiBeesCta({ practice }: Props) {
  return (
    <section className="w-full bg-surface-dark-card text-on-primary py-space-3xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-amber-vibrant) 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-vibrant/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-[1280px] mx-auto px-gutter relative z-10 flex flex-col md:flex-row items-center justify-between gap-space-xl">
        <div className="max-w-xl">
          <h2 className="font-display-hero text-display-hero text-on-primary tracking-tight">
            Ready to move on <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-vibrant to-secondary-container">{practice.name}?</span>
          </h2>
          <p className="font-body-lg text-body-lg text-text-tertiary mt-space-md">
            Engage our principal AI architects to evaluate your infrastructure and build production-grade agentic pipelines.
          </p>
          <div className="flex flex-wrap items-center gap-space-md mt-space-xl">
            <Link className="px-space-xl py-space-md rounded-lg bg-amber-vibrant hover:bg-secondary-container text-surface-dark font-label-ui text-label-ui font-bold transition-all shadow-[0_0_20px_rgba(245,166,35,0.3)] hover:shadow-[0_0_30px_rgba(245,166,35,0.5)] flex items-center gap-2" href="/contact">
              <span>Schedule Production Briefing</span>
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            </Link>
            <Link className="px-space-xl py-space-md rounded-lg bg-surface-dark hover:bg-primary-container text-on-primary font-label-ui text-label-ui border border-border-dark-subtle hover:border-amber-glow transition-all" href="/case-studies">
              Explore Case Studies
            </Link>
          </div>
        </div>
        
        <div className="hidden lg:block w-full max-w-md bg-surface-dark rounded-xl border border-border-dark-subtle p-space-lg font-code-mono text-code-mono text-text-tertiary shadow-2xl">
          <div className="flex items-center gap-2 mb-space-md pb-space-sm border-b border-border-dark-subtle">
            <span className="w-3 h-3 rounded-full bg-error"></span>
            <span className="w-3 h-3 rounded-full bg-secondary-container"></span>
            <span className="w-3 h-3 rounded-full bg-amber-vibrant"></span>
            <span className="text-[11px] ml-2">initialize.ts</span>
          </div>
          <div className="flex flex-col gap-1 text-[13px]">
            <div><span className="text-secondary-fixed">import</span> {'{ BeesAgent }'} <span className="text-secondary-fixed">from</span> <span className="text-amber-vibrant">&apos;@aibees/core&apos;</span>;</div>
            <div className="mt-2"><span className="text-secondary-fixed">const</span> agent = <span className="text-secondary-fixed">new</span> BeesAgent({'{'}</div>
            <div className="pl-4">mode: <span className="text-amber-vibrant">&apos;production&apos;</span>,</div>
            <div className="pl-4">cluster: <span className="text-amber-vibrant">&apos;us-east&apos;</span>,</div>
            <div className="pl-4">latency_profile: <span className="text-amber-vibrant">&apos;ultra-low&apos;</span></div>
            <div>{'});'}</div>
            <div className="mt-2 text-text-secondary">{/* Automatically routes to lowest-latency infer */}</div>
            <div><span className="text-secondary-fixed">await</span> agent.deploy();</div>
          </div>
        </div>
      </div>
    </section>
  );
}
