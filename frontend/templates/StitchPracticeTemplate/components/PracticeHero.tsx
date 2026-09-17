import Link from "next/link";
import type { PracticeDetail } from "@/types/practice";
import { routes } from "@/config/routes";

interface Props { practice: PracticeDetail }

/**
 * Practice Hub Hero — full-bleed navy section with hexagon grid BG,
 * animated eyebrow pill, headline, description, dual CTAs, and
 * floating certification chips. Matches Stitch practice-hub-template.html.
 */
export function PracticeHero({ practice }: Props) {
  return (
    <section
      className="relative bg-[#0B1F3A] overflow-hidden pt-8 pb-16 md:pb-24"
      id="hero"
    >
      {/* Hexagon dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: "radial-gradient(rgba(198,150,58,0.2) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Ambient glow */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[400px] bg-[#C6963A]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Copy — 7 cols */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#071527] border border-[#C6963A]/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#C6963A] animate-ping opacity-75" />
              <span className="w-2 h-2 rounded-full bg-[#C6963A] -ml-3" />
              <span className="text-[11px] font-bold text-[#C6963A] tracking-widest uppercase">
                {practice.hero.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] font-extrabold text-white tracking-tight">
              {practice.hero.title}
            </h1>

            {practice.hero.description && (
              <p className="text-[18px] leading-[28px] text-white/70 max-w-xl">
                {practice.hero.description}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link
                href={practice.hero.cta.url}
                className="inline-flex items-center gap-2 bg-[#C6963A] hover:opacity-90 text-[#0B1F3A] font-bold px-6 py-3.5 rounded shadow-sm transition-all duration-200"
              >
                <span>{practice.hero.cta.label}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              {practice.hero.secondary_cta && (
                <Link
                  href={practice.hero.secondary_cta.url}
                  className="border border-[#C6963A]/40 text-white hover:bg-[#132B4F] px-6 py-3.5 rounded font-semibold transition-colors"
                >
                  {practice.hero.secondary_cta.label}
                </Link>
              )}
              {!practice.hero.secondary_cta && (
                <Link
                  href={routes.practices()}
                  className="border border-[#C6963A]/40 text-white hover:bg-[#132B4F] px-6 py-3.5 rounded font-semibold transition-colors"
                >
                  All Practices
                </Link>
              )}
            </div>

            {/* Certification chips */}
            <div className="mt-3 pt-5 border-t border-white/10 flex flex-wrap items-center gap-4 text-white/60 text-[12px] font-medium">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#C6963A] text-[15px]">verified</span>
                SOC2 Type II Certified
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#C6963A] text-[15px]">security</span>
                ISO 27001 Compliant
              </span>
            </div>
          </div>

          {/* Right panel — 5 cols: proof preview mini-card */}
          {practice.proof_points && practice.proof_points.length > 0 && (
            <div className="lg:col-span-5">
              <div className="rounded-xl bg-[#071527] border border-[#C6963A]/20 p-6 grid grid-cols-2 gap-4">
                {practice.proof_points.slice(0, 4).map((p) => (
                  <div key={p.label} className="flex flex-col p-4 rounded-lg bg-[#0B1F3A]/80 border border-white/8">
                    <span className="text-[28px] leading-none font-bold text-[#C6963A] tracking-tight">
                      {p.value}
                    </span>
                    <span className="text-[12px] font-medium text-white/60 mt-1">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}