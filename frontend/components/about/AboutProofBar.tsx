import { getCompanyFacts, type CompanyFacts } from '@/lib/api/settings';

interface StatItem {
  value: string;
  label: string;
  sublabel: string;
}

/** Figures come from the admin-managed `company.*` settings. */
const stats = (facts: CompanyFacts): StatItem[] => [
  {
    value: facts.established,
    label: 'Established',
    sublabel: 'Operations Inception',
  },
  {
    value: facts.domainExperts,
    label: 'TA & Domain Experts',
    sublabel: 'Dedicated In-House Pods',
  },
  {
    value: facts.enterpriseCustomers,
    label: 'Enterprise Customers',
    sublabel: 'Global Institutional Logos',
  },
  {
    value: String(facts.marketsCount),
    label: 'Delivery Markets',
    sublabel: facts.markets.join(' · '),
  },
];

export default async function AboutProofBar() {
  const facts = await getCompanyFacts();

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-brand-navy-dark border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats(facts).map((s) => (
            <div
              key={s.label}
              className="p-8 rounded-2xl bg-surface-ivory dark:bg-white/5 border border-hairline hover:border-brand-gold/40 transition-all text-center group shadow-sm"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-gold tracking-tight mb-2 group-hover:scale-105 transition-transform duration-200">
                {s.value}
              </div>
              <div className="font-mono text-xs text-ink font-bold uppercase tracking-wider mb-1">
                {s.label}
              </div>
              <div className="text-xs text-ink-muted">
                {s.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
