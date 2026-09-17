'use client';

import React from 'react';
import type { CaseStudyDetail } from '@/types/case-study';

type CaseStudyTopologyProps = {
  caseStudy: CaseStudyDetail;
};

export function CaseStudyTopology({ caseStudy }: CaseStudyTopologyProps) {
  const isDivoOrAi =
    caseStudy.slug.includes('divo') ||
    caseStudy.slug.includes('ai') ||
    caseStudy.slug.includes('bank');

  return (
    <section className="py-20 bg-slate-100/70 border-y border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <span className="font-mono text-xs text-[#C6963A] uppercase tracking-widest block font-bold">
            02 / System Topology
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#0B1F3A] mt-1 tracking-tight">
            {isDivoOrAi
              ? 'Multi-Agent Consensus Architecture'
              : 'Enterprise Architectural Topology'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          {/* Left: Landscape Explanation */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-slate-600 leading-relaxed text-base">
              TeamBees replaced the brittle batch scripting layers with an event-driven{' '}
              <strong className="text-slate-900 font-semibold">Agent Swarm Fabric</strong>.
              Operating on isolated Kubernetes clusters, the swarm coordinates distributed
              intelligence between disconnected core engines.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex gap-4 items-start">
                <div className="w-10 h-10 rounded bg-[#0B1F3A] text-[#C6963A] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">database</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0B1F3A]">Core SAP Ledger & Postgres</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Streaming transaction log emissions ingested via change-data-capture (CDC)
                    pipelines.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex gap-4 items-start">
                <div className="w-10 h-10 rounded bg-[#0B1F3A] text-[#C6963A] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">hub</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0B1F3A]">Agent Swarm Supervisor</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Hierarchical task delegation routing transactions based on complexity and risk
                    thresholds.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex gap-4 items-start">
                <div className="w-10 h-10 rounded bg-[#0B1F3A] text-[#C6963A] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0B1F3A]">
                    Bidirectional CRM Synchronization
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    Real-time enrichment of Salesforce customer records with automated anomaly
                    escalation flags.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Topology Visual Schematic */}
          <div className="lg:col-span-7 bg-[#071324] p-6 sm:p-8 rounded-xl border border-white/10 text-white relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <span className="font-mono text-xs text-[#C6963A] font-semibold tracking-wider">
                SWARM TOPOLOGY // ACTIVE GRAPH
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/70">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Deterministic Execution
              </span>
            </div>

            {/* Schematic Nodes */}
            <div className="space-y-5">
              {/* Ingestion Tier */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3.5 bg-[#0B1F3A]/70 rounded-lg border border-white/10 text-center">
                  <span className="block font-mono text-[10px] text-white/50 uppercase">
                    DATA EMITTER
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white mt-0.5 block">
                    SAP Financials CDC
                  </span>
                </div>
                <div className="p-3.5 bg-[#0B1F3A]/70 rounded-lg border border-white/10 text-center">
                  <span className="block font-mono text-[10px] text-white/50 uppercase">
                    QUEUE FABRIC
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white mt-0.5 block">
                    Apache Kafka Pipeline
                  </span>
                </div>
              </div>

              {/* Down Arrow */}
              <div className="flex justify-center -my-1 text-[#C6963A]">
                <span className="material-symbols-outlined text-[22px]">arrow_downward</span>
              </div>

              {/* LangGraph Supervisor Node */}
              <div className="p-5 rounded-lg bg-gradient-to-r from-[#0B1F3A] to-[#071324] border-2 border-[#C6963A]/60 shadow-lg text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#C6963A] text-[#071324] rounded-full font-mono text-[10px] font-bold tracking-wider">
                  LANGGRAPH ORCHESTRATION LAYER
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                  Autonomous Swarm Supervisor
                </h4>
                <p className="text-xs text-white/70 mt-0.5">
                  Contextual State Machine + Dynamic Tool Routing
                </p>

                {/* Sub agents */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 pt-4 border-t border-white/10">
                  <div className="bg-[#071324]/90 p-2 sm:p-2.5 rounded border border-white/10 text-center">
                    <span className="font-mono text-[10px] text-[#C6963A] block font-semibold">
                      SPECIALIST 01
                    </span>
                    <span className="text-[11px] sm:text-xs text-white">Ledger Classifier</span>
                  </div>
                  <div className="bg-[#071324]/90 p-2 sm:p-2.5 rounded border border-white/10 text-center">
                    <span className="font-mono text-[10px] text-[#C6963A] block font-semibold">
                      SPECIALIST 02
                    </span>
                    <span className="text-[11px] sm:text-xs text-white">BM25 RAG Reranker</span>
                  </div>
                  <div className="bg-[#071324]/90 p-2 sm:p-2.5 rounded border border-white/10 text-center">
                    <span className="font-mono text-[10px] text-[#C6963A] block font-semibold">
                      GATEWAY 03
                    </span>
                    <span className="text-[11px] sm:text-xs text-white">Audit Guardrail</span>
                  </div>
                </div>
              </div>

              {/* Down Arrow */}
              <div className="flex justify-center -my-1 text-[#C6963A]">
                <span className="material-symbols-outlined text-[22px]">arrow_downward</span>
              </div>

              {/* Validation Gate & Sink */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3.5 bg-[#0B1F3A]/80 rounded-lg border border-[#C6963A]/50 text-center">
                  <span className="block font-mono text-[10px] text-[#C6963A] uppercase font-semibold">
                    VALIDATION GATE
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white mt-0.5 block">
                    Human-in-the-Loop (&lt;98.5%)
                  </span>
                </div>
                <div className="p-3.5 bg-[#0B1F3A]/80 rounded-lg border border-white/10 text-center">
                  <span className="block font-mono text-[10px] text-white/50 uppercase">
                    DESTINATION SINK
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white mt-0.5 block">
                    Salesforce Financial CRM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
