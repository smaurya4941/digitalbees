import Link from 'next/link';
import { ArrowRight, Briefcase, Rocket, Users } from 'lucide-react';
import { routes } from '@/config/routes';

const FORKS = [
  {
    icon: Users,
    eyebrow: "I'm hiring",
    title: 'Fill a critical role',
    body: 'Talent Bees puts validated specialists in front of you fast — five gates before a shortlist ever reaches you, typically within two business days.',
    linkText: 'Explore Talent Bees',
    href: routes.practice('talent-bees'),
  },
  {
    icon: Rocket,
    eyebrow: "I'm building",
    title: 'Ship production work',
    body: 'Digital, AI, Quality, ServiceNow, and Energy Bees deliver governed AI agents, zero-defect engineering, and certified platform work — not just headcount.',
    linkText: 'See all practices',
    href: routes.practices(),
  },
  {
    icon: Briefcase,
    eyebrow: "I'm a candidate",
    title: 'Join the bench',
    body: 'See what it actually looks like to work on production systems for enterprise clients, and which roles are open right now.',
    linkText: 'View open roles',
    href: routes.careers(),
  },
] as const;

/**
 * Persona fork — the homepage's first explicit routing decision (Blueprint
 * §4.2 "persona-aware routing", §21 wireframe row 4). Sits directly beneath
 * the hero's trust ticker so a first-time visitor self-selects before
 * scrolling into practice detail.
 */
export default function ReniusPersonaFork() {
  return (
    <section className="py-14 sm:py-16 bg-[#FAFCFF] border-b border-[#CBDFF2]" aria-labelledby="persona-fork-heading">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="max-w-2xl mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FB] border border-[#CBDFF2]">
            <span className="w-2 h-2 rounded-full bg-[#E58A1F]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E6D18]">WHERE DO YOU START?</span>
          </div>
          <h2 id="persona-fork-heading" className="text-2xl sm:text-3xl font-black text-[#0B1F3A] tracking-tight">
            Wherever you&apos;re starting from, there&apos;s a fast path in.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FORKS.map((fork) => (
            <Link
              key={fork.eyebrow}
              href={fork.href}
              className="group flex flex-col rounded-3xl bg-white border border-slate-200/90 hover:border-[#C6963A]/70 shadow-[0_10px_30px_rgba(11,31,58,0.07)] hover:shadow-[0_20px_45px_rgba(11,31,58,0.13)] hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E6D18]"
            >
              <span className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#EAF2FB] text-[#0B1F3A] transition-transform group-hover:scale-110 group-hover:bg-[#0B1F3A] group-hover:text-white">
                <fork.icon className="h-5 w-5" aria-hidden />
              </span>

              <span className="mt-5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#9E6D18]">
                {fork.eyebrow}
              </span>
              <h3 className="mt-1.5 text-lg font-bold text-[#0B1F3A] group-hover:text-[#9E6D18] transition-colors">
                {fork.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">{fork.body}</p>

              <span className="mt-5 pt-5 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#9E6D18] group-hover:text-[#0B1F3A] transition-colors">
                {fork.linkText}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
