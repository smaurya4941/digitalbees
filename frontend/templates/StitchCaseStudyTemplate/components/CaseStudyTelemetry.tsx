'use client';

import React from 'react';
import type { CaseStudyDetail } from '@/types/case-study';

type CaseStudyTelemetryProps = {
  caseStudy: CaseStudyDetail;
};

export function CaseStudyTelemetry({ caseStudy }: CaseStudyTelemetryProps) {
  return (
    <section className="py-20 bg-[#0B1F3A] text-white overflow-hidden relative border-b border-white/10">
      <div className="absolute inset-0 case-study-grid-pattern opacity-20 pointer-events-none" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-4">
          <span className="font-mono text-xs text-[#C6963A] uppercase tracking-widest block font-bold">
            04 / Deep Dive Engineering
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-white mt-1 tracking-tight">
            Autonomous Execution & Telemetry
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-center">
          {/* Interactive Code / Telemetry Console */}
          <div className="lg:col-span-7 bg-[#071324] rounded-xl border border-white/15 overflow-hidden shadow-2xl font-mono">
            {/* Terminal Header */}
            <div className="bg-black/50 px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="text-xs text-white/60 ml-2">teambees-swarm-runtime.log</span>
              </div>
              <span className="text-xs text-[#C6963A] font-semibold tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                LIVE TELEMETRY: OK
              </span>
            </div>

            {/* Terminal Content */}
            <div className="p-5 text-xs space-y-2 text-white/90 leading-relaxed overflow-x-auto">
              <p className="text-white/40"># Initiating Consensus Loop on Transaction ID: TX_98124_DIV</p>
              <p>
                <span className="text-[#C6963A]">[08:14:22.102]</span>{' '}
                <span className="text-sky-400">INGEST:</span> CDC Packet verified. Source: SAP_GL_POSTINGS. Hash: 0x9f8...a21
              </p>
              <p>
                <span className="text-[#C6963A]">[08:14:22.145]</span>{' '}
                <span className="text-purple-400">SUPERVISOR:</span> Dispatched to LedgerSpecialistAgent with intent{' '}
                <span className="text-emerald-300">&apos;RECONCILE_ESCROW&apos;</span>
              </p>
              <p>
                <span className="text-[#C6963A]">[08:14:22.210]</span>{' '}
                <span className="text-amber-300">RAG_RETRIEVE:</span> BM25 Reranker fetched 4 historic dispute patterns. Cosine Sim: 0.962
              </p>

              <div className="bg-[#000615]/80 p-3.5 rounded my-2 border border-white/10 space-y-1">
                <span className="text-[#C6963A] block font-bold text-xs tracking-wider">
                  STATE MACHINE DECISION MATRIX:
                </span>
                <span className="text-white/80 block">
                  Confidence Score: <span className="text-emerald-400 font-bold">99.4%</span> (Threshold &gt;= 98.5%)
                </span>
                <span className="text-white/80 block">
                  Action: <span className="text-white font-bold">AUTO_COMMIT_JOURNAL_ENTRY</span>
                </span>
                <span className="text-white/80 block">
                  Sync Destination: Salesforce CRM Opportunity ID: 0064W00000abcXYZ
                </span>
              </div>

              <p>
                <span className="text-[#C6963A]">[08:14:22.380]</span>{' '}
                <span className="text-emerald-400">AUDIT_LOG:</span> Cryptographic signature generated. Block height: 491,012. Ready for SEC inspect.
              </p>
              <p>
                <span className="text-[#C6963A]">[08:14:22.411]</span>{' '}
                <span className="text-sky-400">SUCCESS:</span> Total latency: 309ms. Zero human intervention needed.
              </p>
            </div>
          </div>

          {/* Key Capabilities Delivered */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="border-l-2 border-[#C6963A] pl-4">
              <h3 className="text-lg font-bold text-white">Autonomous Classification</h3>
              <p className="text-sm text-white/70 mt-1 leading-relaxed">
                Disparate line items are categorized in sub-second cycles using fine-tuned specialized
                models running behind isolated enterprise VPC boundaries.
              </p>
            </div>

            <div className="border-l-2 border-[#C6963A] pl-4">
              <h3 className="text-lg font-bold text-white">Automatic Exception Escalation</h3>
              <p className="text-sm text-white/70 mt-1 leading-relaxed">
                When an anomaly or dispute is detected, the agent constructs a pre-filled Slack or
                CRM briefing for human review, reducing research time from 40 minutes to 3 minutes.
              </p>
            </div>

            <div className="border-l-2 border-[#C6963A] pl-4">
              <h3 className="text-lg font-bold text-white">Bidirectional CRM Synchronization</h3>
              <p className="text-sm text-white/70 mt-1 leading-relaxed">
                Customer record enrichment updates dynamically with accurate settlement state,
                enabling front-line teams to address inquiries without waiting on overnight batch jobs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
