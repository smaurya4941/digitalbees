import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/config/routes';

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-surface-ivory pt-28 pb-12 md:pt-36 md:pb-16 border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-ink-muted mb-8">
          <Link href={routes.home()} className="hover:text-ink transition-colors">
            Home
          </Link>
          <span className="text-hairline-strong">/</span>
          <span className="text-ink-muted">Company</span>
          <span className="text-hairline-strong">/</span>
          <span className="text-ink font-semibold" aria-current="page">
            About Us
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy/5 dark:bg-white/10 text-brand-gold font-mono text-xs font-semibold tracking-wider uppercase border border-brand-gold/30">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              About TeamBees
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.1]">
              Talent and technology, from the same partner
              <span className="text-brand-gold">.</span>
            </h1>

            <p className="text-lg sm:text-xl text-ink-muted max-w-2xl leading-relaxed">
              Seven specialist practices. Four delivery continents. One accountable team that can staff it, build it, test it, and keep it running.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#seven-bees"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-navy text-white font-medium hover:bg-brand-navy-light transition-all shadow-sm group"
              >
                <span>Explore Our Model</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>

              <div className="inline-flex items-center gap-2.5 px-4 py-3 rounded-lg border border-hairline-strong bg-white/80 dark:bg-surface-sunken text-ink font-mono text-xs">
                <svg className="w-4 h-4 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
                <span>Enterprise Delivery Standards</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual & Network Telemetry */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-hairline-strong bg-brand-navy shadow-2xl group">
              <div className="relative h-[380px] sm:h-[440px] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="TeamBees Global Operations Collaboration"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
              </div>

              {/* Sleek Overlay Badge */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-brand-navy/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-brand-gold ring-4 ring-brand-gold/20" />
                  <div>
                    <p className="font-mono text-xs font-semibold tracking-wider text-white uppercase">
                      GLOBAL DELIVERY NETWORK
                    </p>
                    <p className="text-xs text-ink-muted text-gray-300">Follow-the-Sun Engineering</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-white/10 font-mono text-[11px] text-brand-gold border border-brand-gold/30">
                  Est. 2021
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
