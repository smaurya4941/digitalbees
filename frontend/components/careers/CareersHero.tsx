import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/config/routes';

export default function CareersHero() {
  return (
    <section className="relative overflow-hidden bg-surface-ivory pt-28 pb-12 md:pt-36 md:pb-16 border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-ink-muted mb-8">
          <Link href={routes.home()} className="hover:text-ink transition-colors">
            Home
          </Link>
          <span className="text-hairline-strong">/</span>
          <span className="text-ink font-semibold" aria-current="page">
            Careers
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy/5 dark:bg-white/10 text-brand-gold font-mono text-xs font-semibold tracking-wider uppercase border border-brand-gold/30">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              Careers at TeamBees
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.1]">
              Build What&rsquo;s Next. Grow Where It Counts
              <span className="text-brand-gold">.</span>
            </h1>

            <p className="text-lg sm:text-xl text-ink-muted max-w-2xl leading-relaxed">
              Join a high-velocity collective of engineers, practice specialists, and technology consultants delivering production AI, ServiceNow, and critical infrastructure across 4 continents.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#open-roles"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-bold text-sm transition-all shadow-md active:scale-[0.99]"
              >
                <span>Explore Open Positions</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>

              <a
                href="#values"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-hairline-strong bg-white/80 dark:bg-white/10 hover:border-brand-gold text-ink font-semibold text-sm transition-all shadow-sm"
              >
                <span>Life &amp; Operating Culture</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono">
              <Link
                href={routes.careerCandidateResources()}
                className="text-brand-gold hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Candidate Interview Guide</span>
                <span>&rarr;</span>
              </Link>
              <span className="text-ink-muted">&bull;</span>
              <Link
                href={routes.careerDiversity()}
                className="text-brand-gold hover:underline flex items-center gap-1 font-semibold"
              >
                <span>D&amp;I Charter</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual with Telemetry Overlay */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-hairline-strong bg-brand-navy shadow-2xl group">
              <div className="relative h-[380px] sm:h-[440px] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="TeamBees Engineers Collaborating on AI Architecture"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
              </div>

              {/* Floating Dark Glass Badge */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-brand-navy/90 backdrop-blur-md border border-white/10 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-gold ring-4 ring-brand-gold/20" />
                  <p className="font-mono text-xs font-bold tracking-wider text-brand-gold uppercase">
                    AI-ENABLED &bull; HUMAN-VERIFIED &bull; FLEXIBLE BY DESIGN
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-300 font-mono pt-2 border-t border-white/10">
                  <span>4 Global Hubs</span>
                  <span className="text-gray-500">&bull;</span>
                  <span>7 Practices</span>
                  <span className="text-gray-500">&bull;</span>
                  <span className="text-brand-gold font-semibold">Top 1% Engineering Pods</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
