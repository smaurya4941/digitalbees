import Link from 'next/link';
import { routes } from '@/config/routes';

export default function CareersCtaBand() {
  return (
    <section className="py-16 md:py-20 bg-surface-ivory border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-navy text-white p-8 sm:p-12 lg:p-16 border border-brand-gold/30 shadow-2xl relative overflow-hidden text-center md:text-left">
          {/* Subtle Ambient Gold Glow */}
          <div
            className="absolute -right-20 -bottom-20 w-96 h-96 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="font-mono text-xs text-brand-gold font-semibold tracking-wider uppercase block">
                Join TeamBees
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to accelerate your technical career?
              </h2>
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Find your pod, build with modern tooling, and ship work that matters for world-class enterprises across the globe.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-mono text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  SOC2 Type II Certified
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  ISO 27001 Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  Top 1% Global Tech Talent
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center lg:justify-end">
              <a
                href="#open-roles"
                className="px-7 py-3.5 rounded-xl bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-bold text-sm tracking-tight transition-all duration-200 text-center shadow-lg hover:shadow-xl active:scale-[0.99]"
              >
                View Open Roles
              </a>
              <Link
                href="/contact-us?topic=talent-community"
                className="px-7 py-3.5 rounded-xl border border-white/20 hover:border-brand-gold text-white font-semibold text-sm tracking-tight transition-all duration-200 text-center hover:bg-white/5"
              >
                Join Talent Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
