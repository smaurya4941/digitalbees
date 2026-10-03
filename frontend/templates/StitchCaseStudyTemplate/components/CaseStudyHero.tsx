import Link from 'next/link';
import { routes } from '@/config/routes';
import type { CaseStudyDetail } from '@/types/case-study';

type CaseStudyHeroProps = {
  caseStudy: CaseStudyDetail;
};

type Fact = { label: string; value: React.ReactNode };

export function CaseStudyHero({ caseStudy }: CaseStudyHeroProps) {
  const industry = caseStudy.industries[0];
  const clientName = caseStudy.client?.name;
  const description = caseStudy.summary || caseStudy.hero?.description;

  // Only facts the admin actually supplied — no invented defaults.
  const facts: Fact[] = [];
  if (clientName) facts.push({ label: 'Client', value: clientName });
  if (caseStudy.practices.length > 0) {
    facts.push({
      label: caseStudy.practices.length > 1 ? 'Practices' : 'Practice',
      value: caseStudy.practices.map((p, i) => (
        <span key={p.slug}>
          {i > 0 && ' & '}
          <Link href={p.href} className="hover:text-[#C6963A] transition-colors">
            {p.name}
          </Link>
        </span>
      )),
    });
  }
  if (caseStudy.capabilities_used.length > 0) {
    facts.push({ label: 'Services', value: caseStudy.capabilities_used.slice(0, 3).join(', ') });
  }
  if (caseStudy.regions.length > 0) {
    facts.push({
      label: caseStudy.regions.length > 1 ? 'Regions' : 'Region',
      value: caseStudy.regions.map((r) => r.name).join(', '),
    });
  }

  return (
    <section className="relative bg-[#0B1F3A] text-white pt-14 pb-20 overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 case-study-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C6963A]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#C6963A]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-3.5 py-1 rounded-full bg-[#C6963A]/20 border border-[#C6963A]/40 font-mono text-xs text-[#C6963A] tracking-wide uppercase font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C6963A]" />
            Case study
          </span>
          {industry && (
            <Link
              href={routes.industry(industry.slug)}
              className="px-3.5 py-1 rounded-full bg-white/10 border border-white/20 hover:border-white/40 font-mono text-xs text-white tracking-wide uppercase font-semibold transition-colors"
            >
              {industry.name}
            </Link>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[62px] text-white font-bold tracking-tight max-w-4xl mb-6">
          {caseStudy.title}
        </h1>

        {description && (
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mb-10 leading-relaxed">{description}</p>
        )}

        {facts.length > 0 && (
          <dl
            className="grid grid-cols-2 gap-4 p-5 md:p-6 rounded-xl bg-[#071324]/80 border border-white/10 backdrop-blur-md shadow-2xl"
            style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 170px), 1fr))` }}
          >
            {facts.map((fact) => (
              <div key={fact.label} className="min-w-0">
                <dt className="font-mono text-[11px] text-white/50 uppercase tracking-wider mb-1">{fact.label}</dt>
                <dd className="text-sm md:text-base text-white font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
