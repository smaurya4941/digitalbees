import Link from 'next/link';
import { ArrowRight, Users, Code, Bot, TrendingUp, CheckCircle, Terminal, Flame } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const PRACTICES = [
  {
    name: 'Talent Bees',
    slug: 'talent-bees',
    tagline: 'IT Staffing & Bench',
    icon: Users,
    color: '#2563EB',
  },
  {
    name: 'Digital Bees',
    slug: 'digital-bees',
    tagline: 'Software & Cloud Engineering',
    icon: Code,
    color: '#0891B2',
  },
  {
    name: 'AI Bees',
    slug: 'ai-bees',
    tagline: 'Autonomous AI Agent Swarms',
    badge: 'Pod',
    icon: Bot,
    color: '#7C3AED',
  },
  {
    name: 'ServiceNow Bees',
    slug: 'servicenow-bees',
    tagline: 'ITSM, ITOM & Core SaaS',
    icon: Terminal,
    color: '#059669',
  },
  {
    name: 'Quality Bees',
    slug: 'quality-bees',
    tagline: 'QA & Automated Testing',
    icon: CheckCircle,
    color: '#0D9488',
  },
  {
    name: 'Energy Bees',
    slug: 'energy-bees',
    tagline: 'CTRM & Commodity Trading',
    icon: Flame,
    color: '#D97706',
  },
  {
    name: 'Marketing Bees',
    slug: 'marketing-bees',
    tagline: 'B2B Growth & Performance',
    icon: TrendingUp,
    color: '#EA580C',
  },
];

export function PracticesMegaMenu({ onClose }: Props) {
  return (
    <div className="w-[490px] p-3.5 rounded-2xl bg-white/98 backdrop-blur-xl border border-[#CBDFF2] shadow-2xl text-[#0B1F3A]">
      {/* 2-Column Compact Grid: 7 Practices + 1 'View All' card */}
      <div className="grid grid-cols-2 gap-1.5">
        {PRACTICES.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.slug}
              href={`/practices/${p.slug}`}
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#F0F6FC] transition flex items-center gap-2.5 group border border-transparent hover:border-[#CBDFF2]"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${p.color}15`, color: p.color }}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-[#0B1F3A] group-hover:text-[#9E6D18] transition truncate">
                    {p.name}
                  </span>
                  {p.badge && (
                    <span className="text-[8.5px] font-mono font-bold px-1 py-0.2 rounded bg-purple-100 text-purple-700">
                      {p.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 block truncate leading-tight">
                  {p.tagline}
                </span>
              </div>
            </Link>
          );
        })}

        {/* 8th Slot: View All Practices CTA */}
        <Link
          href="/practices"
          onClick={onClose}
          className="p-2 rounded-xl bg-[#F0F6FC]/70 hover:bg-[#F0F6FC] transition flex items-center gap-2.5 group border border-dashed border-[#CBDFF2] hover:border-[#9E6D18]/50"
        >
          <div className="w-7 h-7 rounded-lg bg-[#9E6D18]/15 text-[#9E6D18] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-bold text-xs text-[#9E6D18] group-hover:text-[#0B1F3A] transition block truncate">
              View All 7 Practices
            </span>
            <span className="text-[11px] text-slate-500 block truncate leading-tight">
              Compare pods &amp; specs →
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
