import Link from 'next/link';
import { ArrowRight, Calendar, BookOpen } from 'lucide-react';

const INSIGHTS = [
  {
    category: 'AI & Engineering',
    tagColor: '#6B4FA1',
    date: 'Sep 2026',
    title: 'Engineering Multi-Agent AI Swarms for Deterministic Ledger Audits',
    excerpt: 'How production evaluation suites and strict guardrails transform LLMs into enterprise-safe transaction engines.',
    href: '/blog',
  },
  {
    category: 'Talent & GCCs',
    tagColor: '#3B6A9C',
    date: 'Aug 2026',
    title: 'Transitioning from Fragmented Staffing to Autonomous Pod Topologies',
    excerpt: 'Why GCCs in India and UAE are replacing traditional headcount models with accountable 48h SLA specialist squads.',
    href: '/blog',
  },
  {
    category: 'Enterprise SaaS',
    tagColor: '#246B4E',
    date: 'Jul 2026',
    title: 'OOTB-First Architecture: Eliminating Technical Debt in ServiceNow Rollouts',
    excerpt: 'A blueprint for rapid CMDB cleanup, CSDM alignment, and automated workflow health monitoring.',
    href: '/blog',
  },
];

export default function ReniusInsightsPreview() {
  return (
    <section className="py-20 bg-white border-b border-[#CBDFF2] relative">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FB] border border-[#CBDFF2]">
              <span className="w-2 h-2 rounded-full bg-[#9E6D18]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E6D18]">
                LATEST INSIGHTS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1F3A] tracking-tight">
              A showcase of strategic perspectives <br />
              <span className="text-[#9E6D18]">&amp; engineering blueprints.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl">
              Practical guides and frameworks from our active delivery pods and enterprise advisory directors.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#0B1F3A] font-bold text-xs uppercase tracking-wider border border-[#CBDFF2] shadow-xs transition-all shrink-0"
          >
            <span>All Publications</span>
            <ArrowRight className="h-4 w-4 text-[#9E6D18]" />
          </Link>
        </div>

        {/* 3 Blog/Insight Cards (Renius Blog Format) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INSIGHTS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-[#F8FAFD] border border-[#CBDFF2] hover:border-[#C6963A] hover:bg-white hover:shadow-md transition-all p-7 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border"
                    style={{
                      backgroundColor: `${item.tagColor}15`,
                      color: item.tagColor,
                      borderColor: `${item.tagColor}30`,
                    }}
                  >
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#0B1F3A] group-hover:text-[#9E6D18] transition leading-snug mb-3">
                  <Link href={item.href}>{item.title}</Link>
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">{item.excerpt}</p>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0]">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-[#9E6D18] hover:text-[#0B1F3A] uppercase tracking-wider transition group/link"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
