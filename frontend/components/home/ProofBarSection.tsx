import { Globe, Layers, Users, Award } from 'lucide-react';

/**
 * Proof bar — card-style 4-stat strip docked directly beneath the Homepage Hero.
 * Features high-contrast typography, executive dividers, and verified telemetry icons.
 */
export default function ProofBarSection() {
  const stats = [
    {
      value: '6',
      label: 'Global Regions',
      detail: 'North America, EMEA, APAC & India ODC',
      icon: Globe,
    },
    {
      value: '7',
      label: 'Specialist Practices',
      detail: 'The Seven Bees delivery model',
      icon: Layers,
    },
    {
      value: '850+',
      label: 'Engineers Deployed',
      detail: 'Pre-vetted technical talent',
      icon: Users,
    },
    {
      value: '98%',
      label: 'Client Retention Rate',
      detail: 'Multi-year enterprise contracts',
      icon: Award,
    },
  ];

  return (
    <section className="relative z-20 -mt-10 sm:-mt-14 mb-8">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 gap-6 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xl shadow-brand-navy/5 sm:grid-cols-2 sm:p-8 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex items-start gap-4 ${
                  i < stats.length - 1 ? 'lg:border-r lg:border-neutral-200/70 lg:pr-6' : ''
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0B1F3A]/5 text-[#C6963A]">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[34px] font-extrabold leading-none tracking-tight text-[#0B1F3A] sm:text-[40px]">
                    <span className="bg-gradient-to-r from-[#0B1F3A] to-[#1E3A5F] bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                  </div>
                  <div className="mt-1.5 text-body-sm font-bold text-[#0B1F3A]">
                    {stat.label}
                  </div>
                  <div className="mt-0.5 text-xs text-ink-muted">
                    {stat.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}