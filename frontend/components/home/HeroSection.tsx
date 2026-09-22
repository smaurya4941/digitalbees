import Link from 'next/link';
import { ArrowRight, Compass, ShieldCheck, Lock, Activity, Zap } from 'lucide-react';

/**
 * Homepage Hero — Full-bleed executive kinetic presentation matching the
 * TeamBees brand blueprint. Features rich multi-dimensional dark palette,
 * authoritative gradient typography, high-trust compliance strip, and
 * an enterprise delivery telemetry showcase.
 */
export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#071324] via-[#0B1F3A] to-[#071324] pt-28 pb-20 md:pt-36 md:pb-28 lg:pt-40 lg:pb-32"
      id="hero"
    >
      {/* Background Kinetic Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(rgba(198, 150, 58, 0.3) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient Lighting Cones */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#C6963A]/20 via-[#C6963A]/5 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-blue-600/15 via-indigo-500/5 to-transparent blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left: 7 Columns Copy & Actions */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Eyebrow Capsule */}
            <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-[#C6963A]/35 bg-[#C6963A]/10 px-4 py-1.5 backdrop-blur-md shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C6963A] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C6963A]" />
              </span>
              <span className="text-label-sm font-semibold uppercase tracking-widest text-[#F0C068]">
                Global Talent &amp; Technology Partner
              </span>
              <span className="text-xs text-white/30">•</span>
              <span className="font-mono text-xs text-white/60">The 7 Bees</span>
            </div>

            {/* Authoritative Display Headline */}
            <h1 className="text-[38px] font-extrabold leading-[1.12] tracking-tight sm:text-[50px] sm:leading-[1.1] md:text-[58px] lg:text-[64px]">
              <span className="block bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent">
                Talent and technology,
              </span>
              <span className="mt-1 block bg-gradient-to-r from-[#F7CE78] via-[#E2A944] to-[#C6963A] bg-clip-text text-transparent">
                from the same partner.
              </span>
            </h1>

            {/* Subheading Narrative */}
            <p className="max-w-xl text-body-lg text-neutral-300 leading-relaxed font-normal md:text-[19px] md:leading-[32px]">
              Seven specialist practices. Six global delivery regions. One accountable team that can staff it, build it, test it, and run it — eliminating the friction between rapid deployment velocity and enterprise-grade reliability.
            </p>

            {/* Dual CTAs */}
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/contact-us"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#D8A74A] to-[#C6963A] px-7 py-4 text-body-sm font-extrabold text-[#0B1F3A] shadow-lg shadow-[#C6963A]/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#E5B556] hover:to-[#D5A036] hover:shadow-xl hover:shadow-[#C6963A]/35"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/practices"
                className="group inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.06] px-6 py-4 text-body-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.12]"
              >
                <Compass className="h-4 w-4 text-[#C6963A] transition-transform group-hover:rotate-45" />
                <span>Explore Our Practices</span>
              </Link>
            </div>

            {/* Enterprise Certifications Strip */}
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6 text-xs font-medium text-white/75">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 backdrop-blur-xs">
                <ShieldCheck className="h-4 w-4 text-[#C6963A]" />
                <span>SOC2 Type II Certified</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 backdrop-blur-xs">
                <Lock className="h-4 w-4 text-[#C6963A]" />
                <span>ISO 27001 Compliant</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 backdrop-blur-xs">
                <Activity className="h-4 w-4 text-[#C6963A]" />
                <span>99.9% Delivery Precision</span>
              </div>
            </div>
          </div>

          {/* Right: 5 Columns Technical Architecture & Pod Telemetry Showcase */}
          <div className="relative lg:col-span-5">
            {/* Ambient Aura */}
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-[#C6963A]/20 to-blue-500/20 blur-2xl opacity-60" />

            {/* Bezel Frame */}
            <div className="group relative rounded-3xl border border-white/15 bg-[#071324]/85 p-2 shadow-2xl backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[20px] bg-[#0B1F3A]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0whBuj33YBkh9OZd3r18nEcS5C4CK9UQ_4T3rJFIYsTRfPCWveaK_FUNGxcKA4xKHpQSdjFI4lSqqj25sOeB0t727VxbOphi4JwLI05gEO3uOcjt_3gR9RnzIVb4smp4B9ddDkI8Ibw-yRdbYVHzOlUd_i-CMqYVR_TkBMEwSQd_1AYwoJlvOcsEM43T2g5aQGspdy8Nq97pCpyiJkGQI-CyHVupNkgJAtGw2RCjBz62EW3MVEcdj6NCy-JgRiD-A_-6SbG2jXO4"
                  alt="Enterprise Computational Network"
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071324]/90 via-[#071324]/20 to-transparent" />

                {/* Top-Left Telemetry Capsule */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2.5 rounded-xl border border-white/15 bg-[#071324]/85 px-3.5 py-2 shadow-lg backdrop-blur-md">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C6963A] opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C6963A]" />
                  </span>
                  <span className="text-xs font-semibold text-white tracking-tight">
                    Computational Network Intelligence
                  </span>
                  <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-300">
                    LIVE
                  </span>
                </div>

                {/* Top-Right SLA Status Badge */}
                <div className="absolute top-3.5 right-3.5 hidden sm:flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#071324]/85 px-2.5 py-1.5 text-[11px] font-mono font-bold text-[#C6963A] backdrop-blur-md">
                  <span>48h</span>
                  <span className="text-white/60 font-normal">SLA</span>
                </div>

                {/* Bottom-Right Pipeline Pill */}
                <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2 rounded-xl border border-white/15 bg-[#071324]/85 px-3.5 py-2 shadow-lg backdrop-blur-md">
                  <Zap className="h-4 w-4 text-[#C6963A]" />
                  <span className="text-xs font-semibold text-white tracking-tight">
                    Zero-Latency Pod Pipeline
                  </span>
                </div>
              </div>

              {/* Delivery Telemetry Strip */}
              <div className="mt-2.5 grid grid-cols-2 gap-2 p-1.5">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C6963A]">
                    Squads Deployed
                  </div>
                  <div className="mt-0.5 text-title-md font-extrabold text-white">
                    850+ Engineers
                  </div>
                  <div className="text-[11px] text-white/50">
                    Across 4 Delivery Hubs
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C6963A]">
                    Practice Depth
                  </div>
                  <div className="mt-0.5 text-title-md font-extrabold text-white">
                    7 Disciplines
                  </div>
                  <div className="text-[11px] text-white/50">
                    AI, ServiceNow, CTRM &amp; QA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}