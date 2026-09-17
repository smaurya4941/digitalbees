import Link from "next/link";
import type { PracticeDetail } from "@/types/practice";

interface Props { practice: PracticeDetail }

/**
 * Case study grid — Stitch practice hub Section 7 pattern.
 * Navy cards with gold metric display.
 */
export function PracticeCaseStudies({ practice }: Props) {
  const caseStudies = practice.case_studies ?? [];
  if (caseStudies.length === 0) return null;

  return (
    <section className="py-10" id="case-studies">
      <div className="flex items-center gap-2 text-[#C6963A] text-[12px] font-bold mb-1">
        <span className="w-2 h-0.5 bg-[#C6963A] inline-block" />
        PROOF
      </div>
      <h2 className="text-[24px] leading-[32px] font-bold text-[#0B1F3A] mb-6">
        {practice.name} in production
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {caseStudies.map((cs) => {
          const headline = cs.metrics?.[0];
          return (
            <Link
              key={cs.id ?? cs.slug}
              href={cs.href}
              className="group p-6 rounded-xl bg-[#0B1F3A] border border-[#C6963A]/15 hover:border-[#C6963A]/40 transition-all flex flex-col gap-3"
            >
              {cs.client_name && (
                <span className="text-[11px] font-bold text-[#C6963A] tracking-widest uppercase">
                  {cs.client_name}
                </span>
              )}
              {headline && (
                <div className="text-[28px] leading-none font-extrabold text-[#C6963A]">
                  {headline.value}{" "}
                  <span className="text-[14px] font-normal text-white/60 block mt-1">
                    {headline.label}
                  </span>
                </div>
              )}
              <h3 className="text-[16px] leading-[22px] font-bold text-white group-hover:text-[#C6963A] transition-colors">
                {cs.title}
              </h3>
              {cs.summary && (
                <p className="text-[14px] leading-[20px] text-white/60">{cs.summary}</p>
              )}
              <span className="inline-flex items-center gap-1 text-[#C6963A] text-[13px] font-bold mt-auto">
                Read case study
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}