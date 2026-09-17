import Link from "next/link";
import type { PracticeDetail } from "@/types/practice";

interface Props { practice: PracticeDetail }

/**
 * Practice CTA band — full-bleed navy-900 with hexagon bg, gold gradient text,
 * and dual action buttons. Matches Stitch practice hub Section 9.
 */
export function PracticeCTA({ practice }: Props) {
  return (
    <section
      className="bg-[#0B1F3A] rounded-2xl p-8 lg:p-12 text-white border border-[#C6963A]/40 shadow-2xl relative overflow-hidden"
      id="consultation"
    >
      {/* Glow */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#C6963A]/10 rounded-full blur-3xl pointer-events-none" />
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(198,150,58,0.2) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-2xl space-y-4">
        <span className="px-3 py-1 rounded bg-[#132B4F] text-[12px] font-bold text-[#C6963A] border border-[#C6963A]/30 uppercase tracking-wider inline-block">
          ARCHITECTURE ENGAGEMENT
        </span>
        <h2 className="text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] font-bold text-white">
          Scope your next {practice.name} use case.
        </h2>
        <p className="text-[16px] leading-[24px] text-white/70">
          Tell us about your pipeline or architecture — our delivery leads will assess technical feasibility, legacy integration hooks, and governance upfront.
        </p>
        <div className="pt-4 flex flex-wrap gap-4">
          <Link
            href={practice.hero.cta.url}
            className="bg-[#C6963A] hover:opacity-90 text-[#071527] text-[15px] font-bold px-7 py-3 rounded-lg shadow-md transition-all"
          >
            {practice.hero.cta.label}
          </Link>
          <Link
            href="/case-studies"
            className="border border-white/30 hover:border-[#C6963A] text-white text-[15px] font-medium px-6 py-3 rounded-lg transition-all"
          >
            Explore Case Studies
          </Link>
        </div>
      </div>
    </section>
  );
}