import Link from 'next/link';
import { ArrowRight, Briefcase, GraduationCap, Users, Sparkles } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const CAREER_LINKS = [
  {
    title: 'Open Roles',
    desc: 'Engineering, AI Swarms & Architecture',
    href: '/careers',
    icon: Briefcase,
    badge: '24 Roles',
  },
  {
    title: 'Life at TeamBees',
    desc: 'Culture, Values & Global Pod Teams',
    href: '/careers',
    icon: Users,
  },
  {
    title: 'AI Upskilling & Lab',
    desc: 'GPU Cloud Credits & LLM Certifications',
    href: '/careers',
    icon: Sparkles,
  },
  {
    title: 'Talent Bench Network',
    desc: 'Join as Independent Contractor / Pod Lead',
    href: '/careers',
    icon: GraduationCap,
  },
];

export function CareersMegaMenu({ onClose }: Props) {
  return (
    <div className="w-[330px] p-3 rounded-2xl bg-white/98 backdrop-blur-xl border border-[#CBDFF2] shadow-2xl text-[#0B1F3A]">
      <div className="space-y-0.5">
        {CAREER_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#F0F6FC] transition flex items-center gap-2.5 group border border-transparent hover:border-[#CBDFF2]"
            >
              <div className="w-7 h-7 rounded-lg bg-[#EAF2FB] text-[#0B1F3A] flex items-center justify-center shrink-0 group-hover:bg-[#C6963A]/15 group-hover:text-[#9E6D18] transition-colors">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-[#0B1F3A] group-hover:text-[#9E6D18] transition truncate">
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 block truncate leading-tight">
                  {item.desc}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center justify-between px-1.5">
        <span className="text-[11px] text-slate-400 font-mono">Join The Swarm</span>
        <Link
          href="/careers"
          onClick={onClose}
          className="text-xs font-bold text-[#9E6D18] hover:text-[#0B1F3A] transition flex items-center gap-1"
        >
          <span>Explore Careers</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
