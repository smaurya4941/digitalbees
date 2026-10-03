import type { CaseStudyMetric } from '@/types/case-study';

type CaseStudyResultsProps = {
  results: string | null;
  metrics: CaseStudyMetric[];
};

/**
 * The outcome narrative. Metrics beyond the four shown in the proof bar are
 * listed here so none the admin entered go unseen. Omitted when empty.
 */
export function CaseStudyResults({ results, metrics }: CaseStudyResultsProps) {
  const extraMetrics = metrics.slice(4);
  if (!results && extraMetrics.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="font-mono text-xs text-[#C6963A] uppercase tracking-widest block font-bold">The results</span>
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#0B1F3A] mt-1 tracking-tight">
          What changed for the client
        </h2>
        {results && (
          <p className="mt-6 text-lg sm:text-xl text-slate-700 leading-relaxed whitespace-pre-line">{results}</p>
        )}

        {extraMetrics.length > 0 && (
          <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {extraMetrics.map((metric, idx) => (
              <div key={`${metric.value}-${idx}`} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <dt className="text-sm text-slate-600">{metric.label}</dt>
                <dd className="mt-1 text-2xl font-extrabold font-mono text-[#C6963A]">{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
