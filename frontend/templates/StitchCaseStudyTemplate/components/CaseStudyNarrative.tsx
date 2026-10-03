import type { CaseStudyDetail } from '@/types/case-study';

type CaseStudyNarrativeProps = {
  caseStudy: CaseStudyDetail;
};

/**
 * Challenge → solution, side by side on desktop. Each column renders only when
 * the admin filled it in; capabilities used sit under the solution as chips.
 */
export function CaseStudyNarrative({ caseStudy }: CaseStudyNarrativeProps) {
  const { challenge, solution, capabilities_used: capabilities } = caseStudy;
  if (!challenge && !solution) return null;

  const both = Boolean(challenge && solution);

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className={`max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 ${both ? 'lg:grid-cols-2' : 'max-w-4xl'}`}>
        {challenge && (
          <article className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            <span className="font-mono text-xs text-[#C6963A] uppercase tracking-widest block font-bold">
              The challenge
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A] mt-1 mb-5 tracking-tight">
              What stood in the way
            </h2>
            <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">{challenge}</p>
          </article>
        )}

        {solution && (
          <article className="bg-[#0B1F3A] text-white p-8 sm:p-10 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#C6963A]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <span className="font-mono text-xs text-[#C6963A] uppercase tracking-widest block font-bold">
                Our solution
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 mb-5 tracking-tight">
                What TeamBees built
              </h2>
              <p className="text-white/80 leading-relaxed text-base whitespace-pre-line">{solution}</p>

              {capabilities.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-2" aria-label="Capabilities used">
                  {capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="px-3 py-1 rounded-full bg-white/10 border border-white/15 font-mono text-xs text-white/90"
                    >
                      {capability}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
