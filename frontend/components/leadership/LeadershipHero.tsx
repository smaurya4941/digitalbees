import Link from 'next/link';
import { routes } from '@/config/routes';

export default function LeadershipHero() {
  return (
    <section className="relative overflow-hidden bg-surface-ivory pt-28 pb-10 md:pt-36 md:pb-14 border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-ink-muted mb-8">
          <Link href={routes.home()} className="hover:text-ink transition-colors">
            Home
          </Link>
          <span className="text-hairline-strong">/</span>
          <Link href={routes.about()} className="hover:text-ink transition-colors">
            Company
          </Link>
          <span className="text-hairline-strong">/</span>
          <span className="text-ink font-semibold" aria-current="page">
            Leadership
          </span>
        </nav>

        {/* Hero Header */}
        <div className="max-w-4xl space-y-5 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy/5 dark:bg-white/10 text-brand-gold font-mono text-xs font-semibold tracking-wider uppercase border border-brand-gold/30">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            Organizational Governance
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.1]">
            Executive &amp; Functional Leadership
            <span className="text-brand-gold">.</span>
          </h1>

          <p className="text-lg sm:text-xl text-ink-muted leading-relaxed max-w-3xl">
            Organized by function and domain accountability &mdash; connecting enterprise buyers directly with practice masters and regional delivery directors rather than a generic roster of headshots.
          </p>
        </div>

        {/* Governance Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-hairline">
          <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-hairline shadow-sm">
            <div className="font-mono text-xs text-brand-gold font-bold uppercase tracking-wider mb-0.5">
              Accountability
            </div>
            <div className="text-lg font-extrabold text-ink">100% Dedicated Pods</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-hairline shadow-sm">
            <div className="font-mono text-xs text-brand-gold font-bold uppercase tracking-wider mb-0.5">
              Footprint
            </div>
            <div className="text-lg font-extrabold text-ink">4 Delivery Continents</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-hairline shadow-sm">
            <div className="font-mono text-xs text-brand-gold font-bold uppercase tracking-wider mb-0.5">
              Specialisms
            </div>
            <div className="text-lg font-extrabold text-ink">7 Core Practices</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-hairline shadow-sm">
            <div className="font-mono text-xs text-brand-gold font-bold uppercase tracking-wider mb-0.5">
              Certifications
            </div>
            <div className="text-lg font-extrabold text-ink">SOC2 &amp; ISO 27001</div>
          </div>
        </div>
      </div>
    </section>
  );
}
