import type { PracticeDetail } from "@/types/practice";

interface Props { practice: PracticeDetail }

/**
 * Key capabilities — 4-col dark grid matching Stitch Section 4.
 */
export function PracticeCapabilities({ practice }: Props) {
  const capabilities = practice.key_capabilities ?? [];
  if (capabilities.length === 0) return null;

  return (
    <section className="py-10 bg-[#0B1F3A] rounded-2xl px-8 md:px-12" id="capabilities">
      <div className="flex items-center gap-2 text-[#C6963A] text-[12px] font-bold mb-1">
        <span className="w-2 h-0.5 bg-[#C6963A] inline-block" />
        KEY CAPABILITIES
      </div>
      <h2 className="text-[24px] leading-[32px] md:text-[32px] md:leading-[40px] font-bold text-white mb-2">
        What {practice.name} builds
      </h2>
      <p className="text-[16px] leading-[24px] text-white/60 mb-8">
        Production-grade capabilities, not prototypes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {capabilities.map((cap, idx) => (
          <div
            key={cap.title}
            className="bg-[#071527] border border-[#C6963A]/15 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-full bg-[#0B1F3A] border border-[#C6963A]/30 flex items-center justify-center text-[11px] font-bold text-[#C6963A]">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 h-px bg-[#C6963A]/20" />
            </div>
            <h3 className="text-[16px] leading-[22px] font-bold text-white mb-2">
              {cap.title}
            </h3>
            <p className="text-[13px] leading-[18px] text-white/60">
              {cap.description}
            </p>
            <div className="mt-4 pt-3 border-t border-white/8 text-[11px] font-bold text-[#C6963A] uppercase tracking-wide">
              Core Capability
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}