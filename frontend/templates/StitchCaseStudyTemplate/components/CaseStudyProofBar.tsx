'use client';

import React from 'react';
import type { CaseStudyMetric } from '@/types/case-study';

type CaseStudyProofBarProps = {
  metrics?: CaseStudyMetric[];
};

const defaultMetrics: Array<{ label: string; value: string; category: string }> = [
  {
    category: 'Operational Speed',
    value: '40%',
    label: 'Faster Task Execution Across Ledger Ops',
  },
  {
    category: 'Analyst Efficiency',
    value: '45–60 m',
    label: 'Saved Per User / Day in High-Volume Teams',
  },
  {
    category: 'Precision & Audit',
    value: '99.9%',
    label: 'Ledger Reconcile Accuracy with Zero Leaks',
  },
  {
    category: 'Deployment Velocity',
    value: '14 Days',
    label: 'Production Rollout with Zero Client Downtime',
  },
];

export function CaseStudyProofBar({ metrics }: CaseStudyProofBarProps) {
  const displayMetrics =
    metrics && metrics.length >= 4
      ? metrics.slice(0, 4).map((m, idx) => ({
          category: defaultMetrics[idx]?.category || 'Outcome Metric',
          value: m.value,
          label: m.label,
        }))
      : defaultMetrics;

  return (
    <section className="relative -mt-8 z-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayMetrics.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl bg-[#071324] border border-white/15 shadow-xl flex flex-col justify-between hover:border-[#C6963A]/50 transition-colors"
          >
            <span className="font-mono text-xs text-white/60 uppercase tracking-wider">
              {item.category}
            </span>
            <div className="my-2">
              <span className="text-3xl sm:text-4xl lg:text-[40px] leading-none text-[#C6963A] font-extrabold tracking-tight font-mono">
                {item.value}
              </span>
            </div>
            <span className="text-sm text-white/85 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
