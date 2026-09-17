'use client';

import React from 'react';
import type { ProcessStep } from '@/types/content';

type CaseStudyProcessProps = {
  steps?: ProcessStep[];
  title?: string;
  eyebrow?: string;
};

const defaultSteps = [
  {
    step: 1,
    title: 'Discovery & Schema Scoping',
    description:
      'Deterministic mapping of 180+ custom SAP accounting tables to standard Salesforce ledger entities with zero ambiguous schema conversions.',
  },
  {
    step: 2,
    title: 'Guardrails & Security Protocol',
    description:
      'Enforced zero data leakage RBAC gateways, token obfuscation for PII data, and cryptographic signature generation for state changes.',
  },
  {
    step: 3,
    title: 'Agent Swarm Orchestration',
    description:
      'Multi-agent consensus implementation via LangGraph with fallback circuit breakers and episodic memory vector caching.',
  },
  {
    step: 4,
    title: 'Production Cutover & Monitoring',
    description:
      'Dark-launch shadowing for 72 hours, validation against 2.4M past reconciliations, followed by live zero-downtime cutover.',
  },
];

export function CaseStudyProcess({ steps, title, eyebrow }: CaseStudyProcessProps) {
  const displaySteps = steps && steps.length >= 3 ? steps : defaultSteps;

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs text-[#C6963A] uppercase tracking-widest block font-bold">
            {eyebrow || '03 / Delivery Framework'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#0B1F3A] mt-1 tracking-tight">
            {title || '14-Day Production Cutover Plan'}
          </h2>
          <p className="text-slate-600 mt-2 text-base leading-relaxed">
            A deterministic, milestone-driven protocol designed to transition mission-critical
            operations without pausing active business transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displaySteps.map((stepItem, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-[#C6963A] transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-full border-2 border-[#C6963A] text-[#C6963A] font-mono text-base font-bold flex items-center justify-center mb-6 bg-white shadow-sm">
                0{stepItem.step || idx + 1}
              </div>
              <h3 className="text-base font-bold text-[#0B1F3A] mb-2">{stepItem.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{stepItem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
