import type { CompanyMilestone } from '@/types/company';

interface TimelineStop {
  shortYear: string;
  yearDisplay: string;
  badge: string;
  title: string;
  description: string;
  isLatest?: boolean;
}

const DEFAULT_TIMELINE_STOPS: TimelineStop[] = [
  {
    shortYear: "'21",
    yearDisplay: '2021',
    badge: 'FOUNDING',
    title: 'Contingent Workforce Management',
    description:
      'Started operations in staff augmentation and testing across medical devices, mobile and web apps, and telecom ecosystems.',
  },
  {
    shortYear: "'23",
    yearDisplay: '2023–24',
    badge: 'EXPANSION',
    title: 'Custom Software Development, ServiceNow',
    description:
      'Expanded into iOS and Android native development with manual and automation testing; advanced into the ServiceNow ecosystem.',
  },
  {
    shortYear: "'25",
    yearDisplay: '2025',
    badge: 'INTELLIGENCE',
    title: 'AI & Agentic Automation',
    description:
      'AI-led transformation and custom application development for enterprise processes; formalized partnership with AI Enablement Partner: Emiac Technologies.',
  },
  {
    shortYear: "'26",
    yearDisplay: '2026',
    badge: 'ACTIVE HORIZON',
    title: 'GCC Talent & Capability Enablement',
    description:
      'AI-enabled GCC talent programmes, multidisciplinary capability pods, and managed workforce support for global enterprise organizations.',
    isLatest: true,
  },
];

interface AboutTimelineProps {
  milestones?: CompanyMilestone[];
}

export default function AboutTimeline({ milestones }: AboutTimelineProps) {
  // If backend returned milestones, map them into the timeline format while preserving real deck copy
  const stops: TimelineStop[] =
    milestones && milestones.length > 0
      ? milestones.map((m, idx) => {
          const isLatest = idx === milestones.length - 1 || m.year === 2026;
          const yearDisplay = m.year === 2023 ? '2023–24' : String(m.year);
          const shortYear = `'${String(m.year).slice(-2)}`;
          const badge =
            m.year === 2021
              ? 'FOUNDING'
              : m.year === 2023
              ? 'EXPANSION'
              : m.year === 2025
              ? 'INTELLIGENCE'
              : 'ACTIVE HORIZON';

          return {
            shortYear,
            yearDisplay,
            badge,
            title: m.title || 'Enterprise Milestone',
            description: m.description || '',
            isLatest,
          };
        })
      : DEFAULT_TIMELINE_STOPS;

  return (
    <section className="py-16 md:py-24 bg-surface-ivory border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <span className="font-mono text-xs text-brand-gold font-semibold tracking-wider uppercase block mb-3">
            Our Evolution
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mb-4">
            Milestones of Accountable Growth
          </h2>
          <p className="text-lg text-ink-muted">
            From specialized contingent workforce management to global GCC capability enablement and autonomous AI pods.
          </p>
        </div>

        {/* Horizontal Progression: Desktop */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div
            className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-hairline-strong z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {stops.map((stop) => {
              if (stop.isLatest) {
                return (
                  <div key={stop.yearDisplay} className="flex flex-col">
                    {/* Node Header */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-14 h-14 rounded-full bg-brand-gold text-brand-navy font-mono text-base font-extrabold flex items-center justify-center shadow-lg ring-4 ring-brand-gold/25 shrink-0">
                        {stop.shortYear}
                      </div>
                      <div>
                        <span className="font-mono text-[11px] text-brand-gold font-bold tracking-wider uppercase block">
                          {stop.badge}
                        </span>
                        <span className="text-sm font-semibold text-ink">{stop.yearDisplay}</span>
                      </div>
                    </div>

                    {/* Featured Card */}
                    <div className="p-7 rounded-2xl bg-brand-navy text-white border-2 border-brand-gold shadow-xl flex-1 flex flex-col justify-between relative overflow-hidden">
                      <div
                        className="absolute -right-8 -bottom-8 w-28 h-28 bg-brand-gold/15 rounded-full blur-xl pointer-events-none"
                        aria-hidden="true"
                      />
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-lg text-white tracking-tight leading-snug">
                            {stop.title}
                          </h3>
                          <span className="relative flex h-3 w-3 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-gold" />
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {stop.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-brand-gold">
                        <span>Status</span>
                        <span className="font-semibold uppercase tracking-wider">Active Horizon</span>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={stop.yearDisplay} className="flex flex-col">
                  {/* Node Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-14 h-14 rounded-full bg-white dark:bg-brand-navy-dark border-2 border-hairline-strong text-ink font-mono text-base font-bold flex items-center justify-center shadow-sm shrink-0">
                      {stop.shortYear}
                    </div>
                    <div>
                      <span className="font-mono text-[11px] text-ink-muted font-semibold tracking-wider uppercase block">
                        {stop.badge}
                      </span>
                      <span className="text-sm font-semibold text-ink">{stop.yearDisplay}</span>
                    </div>
                  </div>

                  {/* Standard Card */}
                  <div className="p-7 rounded-2xl bg-white dark:bg-white/5 border border-hairline hover:border-brand-gold/40 transition-all flex-1 flex flex-col justify-between shadow-sm">
                    <div>
                      <h3 className="font-bold text-lg text-ink mb-3 tracking-tight leading-snug">
                        {stop.title}
                      </h3>
                      <p className="text-sm text-ink-muted leading-relaxed">
                        {stop.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-hairline flex items-center justify-between text-xs font-mono text-ink-muted">
                      <span>Era Milestone</span>
                      <span className="text-ink font-semibold">{stop.yearDisplay}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
