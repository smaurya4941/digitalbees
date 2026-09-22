interface StatItem {
  value: string;
  label: string;
  sublabel: string;
}

const STATS: StatItem[] = [
  {
    value: '2021',
    label: 'Established',
    sublabel: 'Operations Inception',
  },
  {
    value: '50+',
    label: 'TA & Domain Experts',
    sublabel: 'Dedicated In-House Pods',
  },
  {
    value: '20+',
    label: 'Enterprise Customers',
    sublabel: 'Global Institutional Logos',
  },
  {
    value: '4',
    label: 'Delivery Markets',
    sublabel: 'Global Delivery Footprint',
  },
];

export default function AboutProofBar() {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-brand-navy-dark border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => (
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
