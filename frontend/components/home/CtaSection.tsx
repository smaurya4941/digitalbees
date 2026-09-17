import Link from "next/link";

/**
 * CTA section — Stitch spec Section 13. Full-bleed navy with gold glow,
 * centered copy, and dual buttons.
 */
export default function CtaSection() {
  return (
    <section
      className="py-16 md:py-24 bg-[#0B1F3A] relative overflow-hidden text-center"
      id="contact"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-[#C6963A]/10 rounded-full blur-[100px]" />
      </div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[24px] leading-[32px] md:text-[56px] md:leading-[64px] font-bold text-white mb-4 tracking-tight">
            Let&apos;s build your team
            <span className="text-[#C6963A]">.</span>
          </h2>
          <p className="text-[18px] leading-[28px] text-white/80 mb-8 max-w-xl mx-auto">
            Tell us what you&apos;re trying to solve — we&apos;ll tell you honestly whether we&apos;re the right fit.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact-us"
              className="bg-[#C6963A] hover:opacity-95 text-[#0B1F3A] text-[16px] font-bold px-8 py-4 rounded shadow-lg transition-all duration-200"
            >
              Book a Consultation
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-white hover:text-[#C6963A] text-[16px] font-semibold px-6 py-4 transition-colors"
            >
              <span>Explore Case Studies</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}