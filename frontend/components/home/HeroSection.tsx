import Link from "next/link";

/**
 * Homepage hero — full-bleed navy section matching the Stitch homepage spec
 * (Section 2). Split 12-col grid: 7 cols copy + 5 cols technical graphic.
 */
export default function HeroSection() {
  return (
    <section
      className="relative bg-[#0B1F3A] overflow-hidden pt-12 pb-14 md:pt-16 md:pb-20"
      id="hero"
    >
      {/* Hexagon dot-grid background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(198,150,58,0.18) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Ambient glow */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#C6963A]/8 blur-[120px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left — 7 cols copy */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#071527] border border-[#C6963A]/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#C6963A] animate-ping opacity-75" />
              <span className="w-2 h-2 rounded-full bg-[#C6963A] -ml-3" />
              <span className="text-[12px] font-semibold text-[#C6963A] tracking-widest uppercase">
                Global Talent &amp; Technology Partner
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[36px] leading-[44px] md:text-[56px] md:leading-[64px] font-extrabold text-white tracking-tight">
              Talent and technology,{" "}
              <span className="text-[#C6963A]">from the same partner.</span>
            </h1>

            <p className="text-[18px] leading-[28px] text-white/70 max-w-xl">
              Seven specialist practices. Six global regions. One team that can
              staff it, build it, test it, and run it so you are never choosing
              between speed and quality.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 bg-[#C6963A] hover:opacity-90 text-[#0B1F3A] font-bold px-6 py-3.5 rounded shadow-sm transition-all duration-200"
              >
                <span>Book a Consultation</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/practices"
                className="border border-[#C6963A]/50 text-white hover:bg-[#132B4F] px-6 py-3.5 rounded font-semibold transition-colors duration-200"
              >
                Explore Our Practices
              </Link>
            </div>

            {/* Certifications strip */}
            <div className="mt-4 pt-5 border-t border-white/10 flex flex-wrap items-center gap-6 text-white/60 text-[12px] font-medium">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#C6963A] text-[16px]">verified</span>
                SOC2 Type II Certified
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#C6963A] text-[16px]">security</span>
                ISO 27001 Compliant
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#C6963A] text-[16px]">speed</span>
                99.9% Delivery Precision
              </span>
            </div>
          </div>

          {/* Right — 5 cols technical graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0B1F3A] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0whBuj33YBkh9OZd3r18nEcS5C4CK9UQ_4T3rJFIYsTRfPCWveaK_FUNGxcKA4xKHpQSdjFI4lSqqj25sOeB0t727VxbOphi4JwLI05gEO3uOcjt_3gR9RnzIVb4smp4B9ddDkI8Ibw-yRdbYVHzOlUd_i-CMqYVR_TkBMEwSQd_1AYwoJlvOcsEM43T2g5aQGspdy8Nq97pCpyiJkGQI-CyHVupNkgJAtGw2RCjBz62EW3MVEcdj6NCy-JgRiD-A_-6SbG2jXO4"
                alt="Enterprise Computational Network"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-[rgba(7,19,36,0.75)] backdrop-blur-md border border-white/10 px-3.5 py-2 rounded shadow-lg flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C6963A]" />
                <span className="text-[12px] font-semibold text-white">Computational Network Intelligence</span>
              </div>
              <div className="absolute bottom-4 right-4 bg-[rgba(7,19,36,0.75)] backdrop-blur-md border border-white/10 px-3.5 py-2 rounded shadow-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C6963A] text-[16px]">bolt</span>
                <span className="text-[12px] font-semibold text-white">Zero-Latency Pipeline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}