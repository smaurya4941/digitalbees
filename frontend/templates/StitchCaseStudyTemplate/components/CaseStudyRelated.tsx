'use client';

import React from 'react';
import Link from 'next/link';
import { routes } from '@/config/routes';

export function CaseStudyRelated() {
  const relatedStudies = [
    {
      practice: 'ServiceNow Bees',
      metric: '70%+',
      title: 'CMDB Enterprise Overhaul',
      description:
        'Pruning hundreds of redundant custom fields to native OOTB architectures for an enterprise manufacturing leader.',
      href: '/case-studies/servicenow-manufacturing-cmdb-csdm',
    },
    {
      practice: 'Energy Bees',
      metric: 'Sub-20ms',
      title: 'Real-Time CTRM Trading Pipeline',
      description:
        'Accelerating commodity trading transaction ingestion and real-time risk positioning for an energy retailer.',
      href: '/case-studies/utility-etrm-modernisation',
    },
    {
      practice: 'Quality Bees',
      metric: 'Zero Defect',
      title: 'Autonomous Self-Healing UI Testing',
      description:
        'Local-first MCP regression automation and compliance verification for mission-critical client software.',
      href: '/case-studies/testbot-self-healing-ui-tests',
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <span className="font-mono text-xs text-[#C6963A] uppercase tracking-widest block font-bold">
              More Client Success Stories
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#0B1F3A] mt-1 tracking-tight">
              Engineered for Scaled Impact
            </h2>
          </div>
          <Link
            href={routes.caseStudies()}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B1F3A] hover:text-[#C6963A] transition-colors"
          >
            View all case studies{' '}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedStudies.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[#C6963A]/60 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="p-6">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-md font-mono text-xs text-slate-700 font-semibold inline-block">
                  {item.practice}
                </span>
                <div className="mt-4 mb-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#C6963A] font-mono block">
                    {item.metric}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0B1F3A] mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={item.href}
                  className="text-sm font-bold text-[#0B1F3A] hover:text-[#C6963A] flex items-center gap-1.5 transition-colors group"
                >
                  Read case study{' '}
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
