import { TECH_STACK_BADGES } from '@/lib/data/template-careers';

export default function CareersLnd() {
  return (
    <section className="py-16 md:py-24 bg-surface-ivory border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-navy text-white p-8 sm:p-12 lg:p-16 border-2 border-brand-gold/40 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Gold Glow */}
          <div
            className="absolute -right-16 -top-16 w-80 h-80 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-10">
            {/* Header */}
            <div className="max-w-3xl space-y-4">
              <span className="font-mono text-xs text-brand-gold font-semibold tracking-wider uppercase block">
                Continuous Upskilling &bull; Production AI
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Master Production AI &amp; High-Consequence Engineering
              </h2>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                TeamBees professionals work across banking, healthcare, energy, and SaaS clients on production AI, ServiceNow, and modern engineering problems &mdash; with structured upskilling paths (including AI/agentic tooling) to keep growing into them.
              </p>
            </div>

            {/* Tech Stack Chips Strip */}
            <div>
              <p className="font-mono text-xs text-brand-gold font-semibold uppercase tracking-wider mb-4">
                Active Production Tooling &amp; Frameworks
              </p>
              <div className="flex flex-wrap gap-2.5">
                {TECH_STACK_BADGES.map((badge) => (
                  <span
                    key={badge}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-brand-gold/20 text-white font-mono text-xs font-semibold border border-white/15 transition-colors"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Concrete L&D Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/15">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl font-extrabold text-brand-gold font-mono mb-1">
                  100% Covered
                </div>
                <div className="text-sm font-bold text-white mb-1">
                  Global Certifications
                </div>
                <p className="text-xs text-gray-300">
                  Full sponsorship for AWS, GCP, Azure, ServiceNow Certified Master, and LangChain credentials.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl font-extrabold text-brand-gold font-mono mb-1">
                  $3,500 / Year
                </div>
                <div className="text-sm font-bold text-white mb-1">
                  Personal Learning Budget
                </div>
                <p className="text-xs text-gray-300">
                  Dedicated annual budget for books, high-end technical conferences, and specialist courses.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl font-extrabold text-brand-gold font-mono mb-1">
                  Weekly
                </div>
                <div className="text-sm font-bold text-white mb-1">
                  Architecture Salons
                </div>
                <p className="text-xs text-gray-300">
                  Peer-to-peer code reviews, agentic benchmarking, and collaborative R&amp;D with practice leads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
