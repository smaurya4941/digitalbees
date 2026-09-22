import { Award, Calendar, CheckCircle2 } from 'lucide-react';

const MILESTONES = [
  {
    year: '2021',
    label: 'Contingent Workforce Management',
    desc: 'Foundational staffing operations delivering validated technology talent across US and India corridors.',
    badge: 'Phase 1',
  },
  {
    year: '2023–24',
    label: 'Custom Software & ServiceNow',
    desc: 'Expanded into full-lifecycle cloud development, DevOps, and certified ServiceNow ITSM/ITOM architecture.',
    badge: 'Phase 2',
  },
  {
    year: '2025',
    label: 'AI & Agentic Automation',
    desc: 'Launched dedicated AI Bees practice delivering production multi-agent swarms and custom LLM workflows.',
    badge: 'Phase 3',
  },
  {
    year: '2026',
    label: 'GCC Talent & Capability Enablement',
    desc: 'Global GCC enablement supporting sovereign client capability pods across 6 delivery hubs.',
    badge: 'Phase 4 · Active',
  },
];

export default function ReniusMilestonesStrip() {
  return (
    <section className="py-20 bg-white border-b border-[#CBDFF2] relative">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FB] border border-[#CBDFF2]">
            <span className="w-2 h-2 rounded-full bg-[#9E6D18]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E6D18]">
              OUR JOURNEY
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1F3A] tracking-tight">
            Four years, <span className="text-[#9E6D18]">four phases of growth.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600">
            From specialized staffing to enterprise-grade autonomous capability engineering, explore our
            foundational evolution.
          </p>
        </div>

        {/* 4 Milestones Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MILESTONES.map((m) => (
            <div
              key={m.year}
              className="p-6 rounded-2xl bg-[#F8FAFD] border border-[#CBDFF2] hover:border-[#C6963A] hover:bg-white hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-[#0B1F3A] group-hover:text-[#9E6D18] transition">
                    {m.year}
                  </span>
                  <span className="text-xl">🏅</span>
                </div>

                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9E6D18] block mb-1">
                  {m.badge}
                </span>

                <h3 className="text-base font-bold text-[#0B1F3A] mb-2 leading-snug">
                  {m.label}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center gap-1.5 text-xs text-emerald-700 font-semibold font-mono">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Verified Milestones</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
