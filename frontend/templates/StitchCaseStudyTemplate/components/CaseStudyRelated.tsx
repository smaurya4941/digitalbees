import Link from 'next/link';
import { routes } from '@/config/routes';
import type { CaseStudySummary } from '@/types/case-study';

type CaseStudyRelatedProps = {
  caseStudies: CaseStudySummary[];
};

/** Up to three other published case studies. Omitted when there are none. */
export function CaseStudyRelated({ caseStudies }: CaseStudyRelatedProps) {
  if (caseStudies.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="font-mono text-xs text-[#C6963A] uppercase tracking-widest block font-bold">
              More client success stories
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#0B1F3A] mt-1 tracking-tight">
              Related case studies
            </h2>
          </div>
          <Link
            href={routes.caseStudies()}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B1F3A] hover:text-[#C6963A] transition-colors"
          >
            View all case studies
            <span className="material-symbols-outlined text-[18px]" aria-hidden>
              arrow_forward
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map((item) => {
            const metric = item.metrics[0];
            return (
              <Link
                key={item.slug}
                href={item.href}
                className="group bg-slate-50 rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-[#C6963A]/60 transition-all duration-200 flex flex-col"
              >
                {item.client_name && (
                  <span className="self-start px-3 py-1 bg-white border border-slate-200 rounded-md font-mono text-xs text-slate-700 font-semibold">
                    {item.client_name}
                  </span>
                )}
                {metric && (
                  <div className="mt-4">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#C6963A] font-mono block">
                      {metric.value}
                    </span>
                    <span className="text-xs text-slate-500">{metric.label}</span>
                  </div>
                )}
                <h3 className="mt-4 text-lg font-bold text-[#0B1F3A] mb-2">{item.title}</h3>
                {item.summary && <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{item.summary}</p>}
                <span className="mt-auto pt-6 text-sm font-bold text-[#0B1F3A] group-hover:text-[#C6963A] inline-flex items-center gap-1.5 transition-colors">
                  Read case study
                  <span
                    className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform"
                    aria-hidden
                  >
                    arrow_forward
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
