import type { PracticeDetail } from "@/types/practice";

interface Props { practice: PracticeDetail }

/**
 * Proof bar — 4-stat horizontal strip. Gold numbers on a light card with
 * vertical dividers. Matches Stitch practice-hub-template.html Section 2.
 */
export function PracticeProofBar({ practice }: Props) {
  const shown = (practice.proof_points ?? []).filter(
    (p) => p.value !== 0 && p.value !== "0"
  );

  if (shown.length === 0) return null;

  return (
    <section
      className="bg-[#f8f9ff] border-b border-[#e7e8ee] py-6"
      id="proof-bar"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x divide-[#e7e8ee] rounded-lg bg-white border border-[#c4c6ce]/30 shadow-sm p-5">
          {shown.slice(0, 4).map((p) => (
            <div key={p.label} className="px-4 py-2 flex flex-col">
              <span className="text-[32px] leading-[40px] font-bold text-[#C6963A] tracking-tight">
                {p.value}
              </span>
              <span className="text-[14px] leading-[20px] text-[#44474d] mt-1 font-medium">
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}