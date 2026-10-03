import type { CaseStudyMetric } from '@/types/case-study';

type CaseStudyProofBarProps = {
  metrics: CaseStudyMetric[];
};

/** Headline outcome metrics, overlapping the hero. Omitted when none are set. */
export function CaseStudyProofBar({ metrics }: CaseStudyProofBarProps) {
  if (metrics.length === 0) return null;

  const shown = metrics.slice(0, 4);
  const cols = { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' }[shown.length];

  return (
    <section className="relative -mt-8 z-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8" aria-label="Key outcomes">
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-4`}>
        {shown.map((item, idx) => (
          <div
            key={`${item.value}-${idx}`}
            className="p-6 rounded-xl bg-[#071324] border border-white/15 shadow-xl hover:border-[#C6963A]/50 transition-colors"
          >
            <span className="block text-3xl sm:text-4xl lg:text-[40px] leading-none text-[#C6963A] font-extrabold tracking-tight font-mono">
              {item.value}
            </span>
            <span className="mt-3 block text-sm text-white/85 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
