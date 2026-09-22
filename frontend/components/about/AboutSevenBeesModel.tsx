import Link from 'next/link';
import { routes } from '@/config/routes';

interface PracticeItem {
  id: string;
  practiceNumber: string;
  name: string;
  slug: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  featured?: boolean;
  icon: string;
}

const PRACTICES: PracticeItem[] = [
  {
    id: 'talent',
    practiceNumber: 'Practice 01',
    name: 'Talent Bees',
    slug: 'talent-bees',
    description: 'IT & executive staffing, contingent talent, and rapid placement across niche enterprise domains with precision vetting.',
    metricLabel: 'Deployment Velocity',
    metricValue: '14-Day Pod Turnaround',
    icon: 'group',
  },
  {
    id: 'digital',
    practiceNumber: 'Practice 02',
    name: 'Digital Bees',
    slug: 'digital-bees',
    description: 'Full-cycle custom software development, cloud modernization, distributed microservices, and high-throughput architectures.',
    metricLabel: 'Engineering Stack',
    metricValue: 'Cloud-Native & Distributed',
    icon: 'terminal',
  },
  {
    id: 'ai',
    practiceNumber: 'Practice 03',
    name: 'AI Bees',
    slug: 'ai-bees',
    description: 'Production agentic workflows, enterprise LLM fine-tuning, RAG pipelines, and autonomous workflow automation.',
    metricLabel: 'Specialization',
    metricValue: 'Autonomous Agents & LLMs',
    featured: true,
    icon: 'smart_toy',
  },
  {
    id: 'marketing',
    practiceNumber: 'Practice 04',
    name: 'Marketing Bees',
    slug: 'marketing-bees',
    description: 'MarTech stack integration, growth engineering, omnichannel telemetry, and enterprise CRM/data analytics.',
    metricLabel: 'Growth Focus',
    metricValue: 'Revenue Telemetry',
    icon: 'insights',
  },
  {
    id: 'quality',
    practiceNumber: 'Practice 05',
    name: 'Quality Bees',
    slug: 'quality-bees',
    description: 'Automated test engineering, continuous regression suites, performance validation, and zero-defect QA pipelines.',
    metricLabel: 'Assurance Model',
    metricValue: 'Zero-Defect Delivery',
    icon: 'verified',
  },
  {
    id: 'servicenow',
    practiceNumber: 'Practice 06',
    name: 'ServiceNow Bees',
    slug: 'servicenow-bees',
    description: 'ITSM, ITOM, and CSM architecture, custom digital workflow orchestration, and enterprise CMDB modernization.',
    metricLabel: 'Ecosystem Tier',
    metricValue: 'Enterprise ITOM/ITSM',
    icon: 'hub',
  },
  {
    id: 'energy',
    practiceNumber: 'Practice 07',
    name: 'Energy Bees',
    slug: 'energy-bees',
    description: 'CTRM & ETRM trading solutions (Endur, Allegro, RightAngle), market risk modeling, and energy telemetry integration.',
    metricLabel: 'Domain Depth',
    metricValue: 'Front-to-Back CTRM',
    icon: 'bolt',
  },
];

export default function AboutSevenBeesModel() {
  return (
    <section id="seven-bees" className="py-16 md:py-24 bg-white dark:bg-brand-navy-dark border-b border-hairline scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-4xl mb-14">
          <span className="font-mono text-xs text-brand-gold font-semibold tracking-wider uppercase block mb-3">
            Integrated Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mb-6">
            The &lsquo;Seven Bees&rsquo; Model, Explained
          </h2>
          <p className="text-lg sm:text-xl text-ink-muted leading-relaxed">
            Most partners make you choose between a staffing firm that stops at the resume and a delivery shop that stops at
            the project. TeamBees organizes around seven specialist practices &mdash; Talent, Digital, AI, Marketing,
            Quality, ServiceNow, and Energy &mdash; so the same accountable team can find your specialists, build with them,
            test what they ship, and keep it running.
          </p>
        </div>

        {/* 12-Column Architectural Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {PRACTICES.map((p) => {
            const colSpan = p.featured
              ? 'lg:col-span-4'
              : p.id === 'talent' || p.id === 'digital'
              ? 'lg:col-span-4'
              : 'lg:col-span-3';

            if (p.featured) {
              return (
                <div
                  key={p.id}
                  className={`${colSpan} relative rounded-2xl bg-brand-navy text-white p-7 border-2 border-brand-gold shadow-xl flex flex-col justify-between overflow-hidden group`}
                >
                  <div
                    className="absolute -right-10 -bottom-10 w-36 h-36 bg-brand-gold/20 rounded-full blur-2xl pointer-events-none"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-brand-gold/20 text-brand-gold flex items-center justify-center border border-brand-gold/40">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
                        </svg>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-gold/20 font-mono text-[10px] text-brand-gold uppercase tracking-wider font-semibold border border-brand-gold/30">
                        Featured Pod
                      </span>
                    </div>

                    <div className="font-mono text-xs text-brand-gold uppercase tracking-wider mb-1 font-semibold">
                      {p.practiceNumber}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                      <Link href={routes.practice(p.slug)} className="hover:text-brand-gold transition-colors">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed mb-6">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400">{p.metricLabel}</span>
                    <span className="text-brand-gold font-semibold">{p.metricValue}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={p.id}
                className={`${colSpan} rounded-2xl bg-surface-ivory dark:bg-white/5 border border-hairline hover:border-brand-gold/50 transition-all p-7 flex flex-col justify-between group shadow-sm hover:shadow-md`}
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-brand-navy/5 dark:bg-white/10 text-brand-navy dark:text-brand-gold flex items-center justify-center mb-5 group-hover:bg-brand-gold/15 group-hover:text-brand-gold transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      {p.icon === 'group' && (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      )}
                      {p.icon === 'terminal' && (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      )}
                      {p.icon === 'insights' && (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      )}
                      {p.icon === 'verified' && (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      )}
                      {p.icon === 'hub' && (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      )}
                      {p.icon === 'bolt' && (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      )}
                    </svg>
                  </div>

                  <div className="font-mono text-xs text-brand-gold uppercase tracking-wider mb-1 font-semibold">
                    {p.practiceNumber}
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-2 tracking-tight group-hover:text-brand-navy transition-colors">
                    <Link href={routes.practice(p.slug)}>
                      {p.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed mb-6">
                    {p.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-hairline flex items-center justify-between text-xs font-mono">
                  <span className="text-ink-muted">{p.metricLabel}</span>
                  <span className="text-ink font-semibold">{p.metricValue}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
