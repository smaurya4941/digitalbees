import Link from "next/link";
import type { PracticeDetail } from "@/types/practice";

interface Props { practice: PracticeDetail }

/**
 * Related practices — "Often Paired With" 2-col cards.
 * Matches Stitch practice hub Section 8.
 */
export function PracticeRelated({ practice }: Props) {
  const related = practice.related_practices ?? [];
  if (related.length === 0) return null;

  return (
    <section className="py-10" id="related">
      <h3 className="text-[20px] leading-[28px] font-bold text-[#0B1F3A] mb-5">
        Often Paired With
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {related.map((rp) => (
          <div
            key={rp.id}
            className="bg-[#FDFDFD] p-6 rounded-xl border border-[#c4c6ce]/40 flex items-start gap-4 hover:border-[#C6963A]/30 transition-colors"
          >
            <div className="w-12 h-12 rounded bg-[#eceef3] flex items-center justify-center text-[#0B1F3A] shrink-0">
              <span className="material-symbols-outlined text-[24px]">hub</span>
            </div>
            <div>
              <h4 className="text-[16px] font-bold text-[#0B1F3A]">{rp.name}</h4>
              {rp.tagline && (
                <p className="text-[14px] leading-[20px] text-[#44474d] mt-1">{rp.tagline}</p>
              )}
              {!rp.tagline && rp.summary && (
                <p className="text-[14px] leading-[20px] text-[#44474d] mt-1">{rp.summary}</p>
              )}
              <Link
                href={rp.href}
                className="mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-[#C6963A] hover:underline"
              >
                Explore {rp.name}
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}