'use client';

import React from 'react';
import type { TechnologySummary } from '@/types/content';

type CaseStudyTechStackProps = {
  technologies?: TechnologySummary[];
};

export function CaseStudyTechStack({ technologies }: CaseStudyTechStackProps) {
  const defaultGroups = [
    {
      category: 'Foundation Models',
      items: ['GPT-4o Enterprise', 'Claude 3.5 Sonnet', 'Embedding Ada 002'],
    },
    {
      category: 'Orchestration',
      items: ['LangGraph', 'Python 3.12', 'FastAPI', 'Pydantic Guardrails'],
    },
    {
      category: 'Data & Messaging',
      items: ['Apache Kafka', 'Redis Cluster', 'PostgreSQL 16', 'SAP CDC'],
    },
    {
      category: 'Infrastructure',
      items: ['AWS EKS', 'Docker Enterprise', 'Terraform Cloud', 'DataDog'],
    },
  ];

  return (
    <section className="py-14 bg-[#071324] border-b border-white/10 text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs font-mono text-[#C6963A] uppercase tracking-widest mb-6 font-bold">
          TECHNOLOGY STACK & RUNTIME ECOSYSTEM
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {defaultGroups.map((group, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#0B1F3A]/60 rounded-xl border border-white/10 hover:border-[#C6963A]/40 transition-colors shadow-lg"
            >
              <span className="block text-xs font-mono text-white/50 uppercase mb-3 tracking-wider font-semibold">
                {group.category}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/15 transition-colors rounded font-mono text-xs font-medium text-white/90"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
