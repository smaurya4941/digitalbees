import { Bot, Cpu, Network, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CAPABILITIES = [
  {
    icon: Bot,
    title: 'Agentic Workflow Automation',
    desc: 'LLM reasoning, smart routing, and RAG pipelines designed for deterministic enterprise workflows.',
    highlight: 'Production Swarms',
  },
  {
    icon: Cpu,
    title: 'Intelligent Process Automation',
    desc: 'Cuts manual effort up to 78% by executing high-volume document & transactional reconciliations.',
    highlight: 'Up to 78% Efficiency',
  },
  {
    icon: Network,
    title: 'Enterprise System Integration',
    desc: 'API orchestration and real-time synchronization across Salesforce, NetSuite, SAP, and Oracle runtimes.',
    highlight: 'Zero Leakage APIs',
  },
  {
    icon: ShieldCheck,
    title: 'Governed & Compliant Execution',
    desc: 'Immutable audit trails, RBAC, customer data encryption, and guaranteed 99.9% uptime SLAs.',
    highlight: 'SOC2 & ISO Ready',
  },
];

export default function ReniusCapabilitiesGrid() {
  return (
    <section className="py-20 bg-white border-b border-[#CBDFF2] relative">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Section Header: Compact & Aligned */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF2FB] border border-[#CBDFF2]">
            <span className="w-2 h-2 rounded-full bg-[#E58A1F]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E6D18]">
              OUR CAPABILITIES
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F3A] tracking-tight">
            Governed AI, <span className="text-[#9E6D18]">built to reach production.</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We don&apos;t just build prototypes. We architect, validate, and embed sovereign AI systems
            directly into enterprise governance frameworks.
          </p>
        </div>

        {/* 4-Column Grid with Rich Drop Shadows & Compact Spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#C6963A]/70 shadow-[0_8px_30px_rgba(11,31,58,0.06)] hover:shadow-[0_20px_45px_rgba(11,31,58,0.13)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Icon Box */}
                  <div className="w-11 h-11 rounded-2xl bg-[#EAF2FB] text-[#0B1F3A] border border-[#CBDFF2] flex items-center justify-center mb-5 group-hover:bg-[#C6963A] group-hover:text-[#0B1F3A] group-hover:border-[#C6963A] transition-all shadow-2xs group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Highlight Badge */}
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9E6D18] bg-[#C6963A]/10 border border-[#C6963A]/20 px-2.5 py-0.5 rounded-full inline-block mb-3">
                    {cap.highlight}
                  </span>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] mb-2 leading-snug group-hover:text-[#9E6D18] transition-colors">
                    {cap.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed">{cap.desc}</p>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/practices/ai-bees"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9E6D18] hover:text-[#0B1F3A] transition-colors group/link"
                  >
                    <span>Explore architecture</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CBDFF2] group-hover:bg-[#C6963A] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
