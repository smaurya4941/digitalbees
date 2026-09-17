'use client';

import React from 'react';
import type { CaseStudyDetail } from '@/types/case-study';

type CaseStudyImpactProps = {
  caseStudy: CaseStudyDetail;
};

export function CaseStudyImpact({ caseStudy }: CaseStudyImpactProps) {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <span className="font-mono text-xs text-[#C6963A] uppercase tracking-widest block font-bold">
            05 / Quantitative Validation
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#0B1F3A] mt-1 tracking-tight">
            Enterprise Business Impact
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {/* Impact 1 */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#0B1F3A] text-[#C6963A] flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[28px]">schedule</span>
              </div>
              <h3 className="text-lg font-bold text-[#0B1F3A] mb-3">Operational Agility</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Eliminated 100% of weekend reconciliation backlogs. Analysts regained 60 minutes each morning,
                redirecting high-value cognitive effort to strategic portfolio risk analysis rather than manual
                spreadsheet syncing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[#C6963A] font-bold text-sm font-mono">
              +3.5 Hours Reinvested Weekly Per Analyst
            </div>
          </div>

          {/* Impact 2 */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#0B1F3A] text-[#C6963A] flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <h3 className="text-lg font-bold text-[#0B1F3A] mb-3">Auditable Precision</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Zero compliance breaches across 2.4 million transactions processed during the first quarter of deployment.
                Every ledger movement possesses a traceable cryptographic origin certificate.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[#C6963A] font-bold text-sm font-mono">
              100% Audit Readiness Maintained
            </div>
          </div>

          {/* Impact 3 */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#0B1F3A] text-[#C6963A] flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[28px]">trending_up</span>
              </div>
              <h3 className="text-lg font-bold text-[#0B1F3A] mb-3">Elastic Scalability</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                During end-of-month financial closing windows, the swarm effortlessly scaled to 5x standard throughput
                without adding headcount or expanding operational support shifts.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[#C6963A] font-bold text-sm font-mono">
              500% Peak Volume Handled Autonomously
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
