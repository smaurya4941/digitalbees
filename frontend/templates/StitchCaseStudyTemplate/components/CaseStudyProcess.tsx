import type { ProcessStep } from '@/types/content';

type CaseStudyProcessProps = {
  steps: ProcessStep[];
};

/** The delivery steps the admin recorded for this engagement. Omitted when empty. */
export function CaseStudyProcess({ steps }: CaseStudyProcessProps) {
  if (steps.length === 0) return null;

  const cols = steps.length >= 4 ? 'lg:grid-cols-4' : steps.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2';

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-mono text-xs text-[#C6963A] uppercase tracking-widest block font-bold">
            How we delivered
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#0B1F3A] mt-1 tracking-tight">
            The delivery path
          </h2>
        </div>

        <ol className={`grid grid-cols-1 md:grid-cols-2 ${cols} gap-6`}>
          {steps.map((step, idx) => (
            <li
              key={`${step.title}-${idx}`}
              className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-[#C6963A] transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-full border-2 border-[#C6963A] text-[#C6963A] font-mono text-base font-bold flex items-center justify-center mb-6 bg-white shadow-sm">
                {String(step.step || idx + 1).padStart(2, '0')}
              </div>
              <h3 className="text-base font-bold text-[#0B1F3A] mb-2">{step.title}</h3>
              {step.description && <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
