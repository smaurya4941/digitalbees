import Link from "next/link";

/**
 * AI Bees spotlight — Stitch spec Section 8.
 * Split layout: left copy/CTAs, right interactive terminal widget.
 */
export default function AiBeesSpotlight() {
  return (
    <section
      className="py-16 md:py-24 bg-[#0B1F3A] text-white relative overflow-hidden"
      id="ai-bees"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(198,150,58,0.25) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6b4fa1]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <div>
            <span className="text-[12px] font-bold text-[#C6963A] tracking-wider uppercase mb-3 block">
              AI Bees — Production AI Practice
            </span>
            <h2 className="text-[24px] leading-[32px] md:text-[36px] md:leading-[44px] font-bold text-white mb-4">
              AI that makes it into{" "}
              <span className="text-[#C6963A]">production.</span>
            </h2>
            <p className="text-[18px] leading-[28px] text-white/70 mb-4">
              Most AI initiatives stall between prototype and production. AI Bees closes that gap — from use-case scoping and architecture through integration, guardrails, and monitoring — so what you ship is something your team can actually run and trust.
            </p>

            {/* 3 Proof Points per Wireframe */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
              <div className="p-3 rounded-lg bg-[#071527]/90 border border-[#C6963A]/25">
                <span className="text-[20px] font-bold text-[#C6963A] block">14 Days</span>
                <span className="text-[12px] text-white/80 font-medium leading-tight block mt-0.5">Production Cutover</span>
              </div>
              <div className="p-3 rounded-lg bg-[#071527]/90 border border-[#C6963A]/25">
                <span className="text-[20px] font-bold text-[#C6963A] block">99.9%</span>
                <span className="text-[12px] text-white/80 font-medium leading-tight block mt-0.5">Zero-Hallucination Gate</span>
              </div>
              <div className="p-3 rounded-lg bg-[#071527]/90 border border-[#C6963A]/25">
                <span className="text-[20px] font-bold text-[#C6963A] block">Zero Leak</span>
                <span className="text-[12px] text-white/80 font-medium leading-tight block mt-0.5">Isolated VPC Clusters</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                href="/practices/ai-bees"
                className="inline-flex items-center gap-2 bg-[#C6963A] hover:opacity-90 text-[#0B1F3A] font-bold px-6 py-3.5 rounded transition-all"
              >
                <span>Explore AI Bees</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-[#C6963A]/50 text-white px-6 py-3.5 rounded font-semibold transition-colors"
              >
                Talk to an AI Architect
              </Link>
            </div>
          </div>

          {/* Right — terminal console */}
          <div className="rounded-xl bg-[#071527] border border-[#C6963A]/20 shadow-2xl p-5 font-mono text-[13px]">
            {/* Terminal header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ba1a1a]" />
                <span className="w-3 h-3 rounded-full bg-[#C6963A]" />
                <span className="w-3 h-3 rounded-full bg-[#4a8f6b]" />
                <span className="text-[11px] text-white/40 ml-2">agent_cluster_us_east.prod</span>
              </div>
              <span className="text-[11px] text-[#C6963A] bg-[#C6963A]/10 px-2 py-0.5 rounded">
                ONLINE ● 99.98% SLA
              </span>
            </div>
            {/* Agent trace */}
            <div className="flex flex-col gap-2.5 text-[12px]">
              <div className="flex items-start gap-2 text-white/50">
                <span className="text-[#C6963A] shrink-0">09:41:02</span>
                <span>[Supervisor] Intent classified: Cross-system reconciliation (SAP → CRM)</span>
              </div>
              <div className="p-3 rounded bg-[#0B1F3A] border border-[#C6963A]/20">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-[#ffdea9]">Specialist: Divo-Finance-Agent</span>
                  <span className="text-[#C6963A] font-semibold">Confidence: 99.4%</span>
                </div>
                <div className="text-white/40 text-[11px] mb-2">
                  Executing zero-hallucination semantic RAG with BM25 rerank...
                </div>
                <div className="w-full bg-[#071527] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#C6963A] h-full" style={{ width: "80%" }} />
                </div>
              </div>
              <div className="flex items-start gap-2 text-white/50">
                <span className="text-[#C6963A] shrink-0">09:41:05</span>
                <span>[Validation] Deterministic schema check: PASSED (Zero data leakage)</span>
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px] text-white/40">
                <span>Memory Store: Episodic DB</span>
                <span>Latency: 284ms</span>
                <span className="text-[#C6963A]">Cost: $0.0028</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}