import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPractices } from '@/lib/api/practices';
import { practiceColor, tint } from '@/lib/practices/visuals';
import { PracticeIcon } from '@/components/ui/PracticeIcon';

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

function countWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

/** "A, B, and C" — list formatting for the practice names in the intro copy. */
function joinNames(names: string[]): string {
  if (names.length <= 2) return names.join(' and ');
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

/**
 * The practice bento on About / Our Story. Every card is a live, published
 * practice (admin-managed); sort order in the admin decides placement — the
 * third card takes the featured treatment.
 */
export default async function AboutSevenBeesModel() {
  const practices = await getPractices();
  if (practices.length === 0) return null;

  const shortNames = practices.map((p) => p.name.replace(/\s+Bees$/i, ''));

  return (
    <section id="seven-bees" className="py-16 md:py-24 bg-white dark:bg-brand-navy-dark border-b border-hairline scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-14">
          <span className="font-mono text-xs text-brand-gold-deep font-semibold tracking-wider uppercase block mb-3">
            Integrated Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mb-6">
            The &lsquo;{countWord(practices.length).replace(/^\w/, (c) => c.toUpperCase())} Bees&rsquo; Model, Explained
          </h2>
          <p className="text-lg sm:text-xl text-ink-muted leading-relaxed">
            Most partners make you choose between a staffing firm that stops at the resume and a delivery shop that stops at
            the project. TeamBees organizes around {countWord(practices.length)} specialist practices &mdash;{' '}
            {joinNames(shortNames)} &mdash; so the same accountable team can find your specialists, build with them, test
            what they ship, and keep it running.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {practices.map((p, index) => {
            const color = practiceColor(p.color_token);
            const number = `Practice ${String(index + 1).padStart(2, '0')}`;
            const colSpan = index < 3 ? 'lg:col-span-4' : 'lg:col-span-3';
            const services = p.sub_services_count ?? 0;
            const featured = index === 2;

            if (featured) {
              return (
                <Link
                  key={p.slug}
                  href={p.href}
                  className={`${colSpan} relative rounded-2xl bg-brand-navy text-white p-7 border-2 border-brand-gold shadow-xl flex flex-col justify-between overflow-hidden group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold`}
                >
                  <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-brand-gold/20 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-brand-gold/20 text-brand-gold flex items-center justify-center border border-brand-gold/40">
                        <PracticeIcon name={p.icon} className="w-6 h-6" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-gold/20 font-mono text-[10px] text-brand-gold uppercase tracking-wider font-semibold border border-brand-gold/30">
                        Featured Pod
                      </span>
                    </div>
                    <div className="font-mono text-xs text-brand-gold uppercase tracking-wider mb-1 font-semibold">{number}</div>
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-brand-gold transition-colors">{p.name}</h3>
                    {p.summary && <p className="text-sm text-gray-300 leading-relaxed mb-6 line-clamp-4">{p.summary}</p>}
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400">{p.tagline ?? 'Explore the practice'}</span>
                    <ArrowRight className="h-4 w-4 text-brand-gold transition-transform group-hover:translate-x-1" aria-hidden />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={p.slug}
                href={p.href}
                className={`${colSpan} rounded-2xl bg-surface-ivory dark:bg-white/5 border border-hairline hover:border-brand-gold/50 transition-all p-7 flex flex-col justify-between group shadow-sm hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold`}
              >
                <div>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: tint(color), color }}
                  >
                    <PracticeIcon name={p.icon} className="w-5 h-5" />
                  </div>
                  <div className="font-mono text-xs text-brand-gold-deep uppercase tracking-wider mb-1 font-semibold">{number}</div>
                  <h3 className="text-xl font-bold text-ink mb-2 tracking-tight group-hover:text-brand-navy transition-colors">{p.name}</h3>
                  {p.summary && <p className="text-sm text-ink-muted leading-relaxed mb-6 line-clamp-4">{p.summary}</p>}
                </div>
                <div className="pt-4 border-t border-hairline flex items-center justify-between text-xs font-mono">
                  <span className="text-ink-muted truncate">{p.tagline ?? 'Explore the practice'}</span>
                  {services > 0 && (
                    <span className="shrink-0 text-ink font-semibold">
                      {services} {services === 1 ? 'service' : 'services'}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
