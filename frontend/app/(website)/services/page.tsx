import type { Metadata } from 'next';
import Link from 'next/link';
import { getServicePillars } from '@/lib/api/services';
import { routes } from '@/config/routes';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Services & Practice Solutions | TeamBees',
  description:
    'Explore enterprise staff augmentation, autonomous AI workflow automation, and custom software development services delivered by pre-vetted senior engineering pods.',
  alternates: { canonical: 'https://www.teambees.com/services' },
};

export default async function ServicesHubPage() {
  const pillars = await getServicePillars();

  const breadcrumbs = [
    { label: 'Home', href: routes.home() },
    { label: 'Services', href: routes.services() },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#0B1F3A]">
      <nav className="border-b border-[#C4C6CE]/30 bg-white py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </nav>

      <section className="bg-[#0B1F3A] text-white py-16 md:py-24 px-4 md:px-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(198, 150, 58, 0.35) 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="max-w-7xl mx-auto relative text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C6963A]/40 bg-[#C6963A]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#C6963A] mb-4">
            ENTERPRISE CAPABILITIES
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white max-w-3xl mx-auto leading-tight">
            Specialized Engineering & Talent Services
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            High-velocity software engineering, dedicated development pods, and autonomous agentic workflows tailored for modern enterprises.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.slug}
              className="rounded-2xl border border-[#C4C6CE]/40 bg-white p-8 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl hover:border-[#C6963A]"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C6963A]">
                  CORE PILLAR
                </span>
                <h2 className="mt-2 text-2xl font-bold text-[#0B1F3A]">{pillar.name}</h2>
                <p className="mt-3 text-sm text-[#44474d] leading-relaxed">
                  {pillar.description}
                </p>

                <div className="mt-6 border-t border-[#C4C6CE]/30 pt-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Key Highlights
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {pillar.stats.slice(0, 2).map((st, i) => (
                      <div key={i} className="bg-slate-50 rounded-lg p-2.5">
                        <div className="text-base font-bold text-[#C6963A]">{st.value}</div>
                        <div className="text-[11px] text-slate-500">{st.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#C4C6CE]/30">
                <Link
                  href={routes.servicePillar(pillar.slug)}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#0B1F3A] py-3 text-sm font-semibold text-white transition-all hover:bg-[#C6963A] hover:text-[#071527]"
                >
                  <span>Explore {pillar.name}</span>
                  <span className="material-symbols-outlined ml-2 text-base">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
