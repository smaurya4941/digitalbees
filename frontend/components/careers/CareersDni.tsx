import Link from 'next/link';
import { routes } from '@/config/routes';
import { DNI_PILLARS } from '@/lib/data/template-careers';

export default function CareersDni() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-brand-navy-dark border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-surface-ivory dark:bg-white/5 border border-hairline-strong p-8 sm:p-12 lg:p-16 shadow-sm">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs text-brand-gold font-semibold tracking-wider uppercase block mb-3">
              Sovereign Respect
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mb-4">
              Sovereign Respect &amp; Inclusive Culture
            </h2>
            <p className="text-lg text-ink-muted leading-relaxed">
              We operate across India, the United States, Singapore, and the UAE. In an enterprise consultancy, true diversity is measured by objective evaluation, psychological safety, and equal pathways to leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {DNI_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="p-7 rounded-2xl bg-white dark:bg-white/5 border border-hairline hover:border-brand-gold/40 transition-all shadow-sm"
              >
                <span className="inline-block px-2.5 py-0.5 rounded bg-brand-navy/5 dark:bg-white/10 text-brand-navy dark:text-brand-gold font-mono text-[10px] font-semibold tracking-wider uppercase mb-4 border border-brand-gold/25">
                  {pillar.tag}
                </span>
                <h3 className="text-xl font-bold text-ink mb-2 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Compliance & Audit Badges */}
          <div className="pt-8 border-t border-hairline flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-white/10 border border-hairline text-xs font-mono text-ink">
                <svg className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
                <span>Equal Opportunity Employer</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-white/10 border border-hairline text-xs font-mono text-ink">
                <svg className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span>Global Pay Equity Audited</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-white/10 border border-hairline text-xs font-mono text-ink">
                <svg className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
                <span>Zero Tolerance Harassment Policy</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={routes.careerDiversity()}
                className="font-mono text-xs text-brand-gold font-semibold hover:underline flex items-center gap-1.5"
              >
                <span>Read Full D&amp;I Charter</span>
                <span>&rarr;</span>
              </Link>
              <span className="font-mono text-xs text-ink-muted hidden sm:inline">
                &bull; SOC2 &amp; ISO Aligned
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
