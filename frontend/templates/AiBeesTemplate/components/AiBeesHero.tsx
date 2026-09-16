import React from 'react';
import Link from 'next/link';
import type { PracticeDetail } from '@/types/practice';

interface Props {
  practice: PracticeDetail;
}

export function AiBeesHero({ practice }: Props) {
  return (
    <section className="relative w-full bg-surface-dark text-on-primary overflow-hidden pb-space-3xl pt-space-xl">
      {/* Ambient glowing grid backdrop */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(var(--color-amber-vibrant) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      ></div>
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-amber-vibrant/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-gutter relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            {/* Live Telemetry Pill Badge */}
            <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-dark-card shadow-sm w-fit">
              <span className="w-2 h-2 rounded-full bg-amber-vibrant animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-amber-vibrant -ml-3"></span>
              <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-amber-vibrant">
                {practice.name} Practice
              </span>
              <span className="text-text-tertiary font-code-mono text-code-mono text-[11px]">
                | v4.2 Production Runtime
              </span>
            </div>

            {/* Hero Display Title */}
            <h1 className="font-display-hero text-display-hero tracking-tight text-on-primary">
              {(practice.hero?.title || practice.name).split(', ').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {i === arr.length - 1 ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-vibrant via-secondary-container to-amber-200">
                      {part}
                    </span>
                  ) : (
                    <>{part}, </>
                  )}
                </React.Fragment>
              ))}
            </h1>
            <p className="font-body-lg text-body-lg text-text-tertiary max-w-2xl">
              {practice.hero?.description}
            </p>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
              <Link
                className="px-space-xl py-space-md rounded-lg bg-amber-vibrant hover:bg-secondary-container text-surface-dark font-label-ui text-label-ui font-bold transition-all transform hover:scale-[1.01] shadow-lg flex items-center gap-space-xs group"
                href="/contact"
              >
                <span>Start a conversation</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
              <Link
                className="px-space-xl py-space-md rounded-lg bg-surface-dark-card hover:bg-primary-container text-on-primary font-label-ui text-label-ui transition-all flex items-center gap-space-xs"
                href="/practices"
              >
                <span>Explore all practices</span>
                <span className="material-symbols-outlined text-[16px] text-text-tertiary">
                  open_in_new
                </span>
              </Link>
            </div>
          </div>

          {/* Right Side: Real-time Multi-Agent Console Visual */}
          <div className="lg:col-span-5 w-full">
            <div className="rounded-xl bg-surface-dark-card shadow-2xl p-space-lg relative">
              <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-primary-container/40 -mx-space-lg -mt-space-lg px-space-lg py-space-sm rounded-t-xl">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-error"></span>
                  <span className="w-3 h-3 rounded-full bg-secondary-container"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-vibrant"></span>
                  <span className="font-code-mono text-code-mono text-text-tertiary text-[11px] ml-2">
                    agent_cluster_us_east.prod
                  </span>
                </div>
                <span className="font-code-mono text-[11px] text-amber-vibrant bg-amber-glow px-2 py-0.5 rounded">
                  ONLINE • 99.98% SLA
                </span>
              </div>
              
              {/* Agent Trace Mock */}
              <div className="flex flex-col gap-space-sm font-code-mono text-code-mono text-[12px]">
                <div className="flex items-start gap-2 text-text-tertiary">
                  <span className="text-amber-vibrant">09:41:02</span>
                  <span>[Supervisor] Intent classified: Cross-system reconcilation (SAP ↔ CRM)</span>
                </div>
                <div className="p-space-sm rounded bg-surface-dark text-on-primary flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-secondary-fixed">Specialist: Divo-Finance-Agent</span>
                    <span className="text-amber-vibrant font-medium">Confidence: 99.4%</span>
                  </div>
                  <div className="text-text-tertiary text-[11px]">
                    Executing zero-hallucination semantic RAG with BM25 rerank...
                  </div>
                  <div className="w-full bg-surface-dark-card h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-amber-vibrant h-full w-4/5"></div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-text-tertiary">
                  <span className="text-amber-vibrant">09:41:05</span>
                  <span>[Validation] Deterministic schema check: PASSED (Zero data leakage)</span>
                </div>
                <div className="flex items-center justify-between pt-space-xs text-[11px] text-text-secondary">
                  <span>Memory Store: Episodic DB</span>
                  <span>Latency: 284ms</span>
                  <span className="text-amber-vibrant">Cost: $0.0028</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
