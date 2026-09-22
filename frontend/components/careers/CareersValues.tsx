import { CORE_VALUES } from '@/lib/data/template-careers';

export default function CareersValues() {
  return (
    <section id="values" className="py-16 md:py-24 bg-white dark:bg-brand-navy-dark border-b border-hairline scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <span className="font-mono text-xs text-brand-gold font-semibold tracking-wider uppercase block mb-3">
            Our Core Values
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mb-4">
            Engineering Discipline. Human Empowerment.
          </h2>
          <p className="text-lg text-ink-muted leading-relaxed">
            We don’t believe in superficial agency culture or unvetted placements. Our operating discipline translates directly into the autonomy, respect, and technical depth you experience every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_VALUES.map((val) => (
            <div
              key={val.number}
              className="p-7 rounded-2xl bg-surface-ivory dark:bg-white/5 border border-hairline hover:border-brand-gold/50 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-2xl font-extrabold text-brand-gold">
                    {val.number}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-brand-navy/5 dark:bg-white/10 text-brand-navy dark:text-brand-gold border border-brand-gold/25 font-mono text-[10px] font-semibold uppercase tracking-wider">
                    {val.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-ink mb-1 tracking-tight group-hover:text-brand-navy dark:group-hover:text-brand-gold transition-colors">
                  {val.title}
                </h3>
                <p className="font-mono text-xs text-brand-gold font-medium mb-4">
                  {val.tagline}
                </p>

                <p className="text-sm text-ink-muted leading-relaxed">
                  {val.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-hairline flex items-center gap-2 font-mono text-xs text-ink-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <span>Operating Pillar</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
