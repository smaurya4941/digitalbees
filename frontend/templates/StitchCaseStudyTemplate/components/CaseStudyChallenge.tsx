'use client';

import React from 'react';
import type { CaseStudyDetail } from '@/types/case-study';

type CaseStudyChallengeProps = {
  caseStudy: CaseStudyDetail;
};

export function CaseStudyChallenge({ caseStudy }: CaseStudyChallengeProps) {
  const challengeBody =
    caseStudy.challenge ||
    'Contact centre volumes were growing faster than headcount and routine requests dominated analyst time. Financial analysts spent upwards of 3 hours every morning manually parsing batch extracts and reconciling ledgers.';

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <span className="font-mono text-xs text-[#C6963A] uppercase tracking-widest block font-bold">
            01 / Operational Bottleneck
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#0B1F3A] mt-1 tracking-tight">
            The Enterprise Challenge
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          {/* Left: The Business Problem */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-[#0B1F3A] mb-4">
              Disparate Systems, Manual Latency & Operational Fragility
            </h3>
            <p className="text-slate-600 mb-4 leading-relaxed text-base">{challengeBody}</p>
            <p className="text-slate-600 mb-6 leading-relaxed text-base">
              This fragmented manual pipeline not only caused customer-facing transaction dispute
              backlogs of 48+ hours, but also elevated operational risk during high-volume periods
              where a single transposition error could trigger costly regulatory reconciliations.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-[22px]">error</span>
                <span className="font-mono text-xs sm:text-sm text-slate-800 font-semibold">
                  3-Hour Daily Delay
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-[22px]">warning</span>
                <span className="font-mono text-xs sm:text-sm text-slate-800 font-semibold">
                  High Transposition Risk
                </span>
              </div>
            </div>
          </div>

          {/* Right: Executive Constraints Box */}
          <div className="lg:col-span-5 bg-[#071324] text-white p-6 sm:p-8 rounded-xl border-l-4 border-l-[#C6963A] border-t border-r border-b border-white/10 shadow-xl">
            <span className="font-mono text-xs text-[#C6963A] uppercase tracking-wider block mb-2 font-semibold">
              Architectural Mandates
            </span>
            <h3 className="text-lg sm:text-xl font-bold mb-6 text-white">Strict Non-Negotiables</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#C6963A] text-[22px] shrink-0 mt-0.5">
                  verified_user
                </span>
                <div>
                  <strong className="block text-white font-semibold text-sm">
                    SOC2 Type II & Banking Compliance
                  </strong>
                  <span className="text-white/70 text-xs leading-relaxed mt-0.5 block">
                    All LLM inference required dedicated, isolated VPC endpoints with zero public
                    tenant telemetry caching.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#C6963A] text-[22px] shrink-0 mt-0.5">
                  balance
                </span>
                <div>
                  <strong className="block text-white font-semibold text-sm">
                    Zero Hallucination Tolerance
                  </strong>
                  <span className="text-white/70 text-xs leading-relaxed mt-0.5 block">
                    Deterministic ledger state transitions. If an autonomous agent confidence dips
                    below 98.5%, it must yield to human oversight.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#C6963A] text-[22px] shrink-0 mt-0.5">
                  history_edu
                </span>
                <div>
                  <strong className="block text-white font-semibold text-sm">
                    Immutable Audit Logging
                  </strong>
                  <span className="text-white/70 text-xs leading-relaxed mt-0.5 block">
                    Cryptographically stamped chain of execution for every classification and sync
                    step for SEC/FINRA audit readiness.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
