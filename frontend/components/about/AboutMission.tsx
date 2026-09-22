export default function AboutMission() {
  return (
    <section className="py-12 md:py-16 bg-surface-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-brand-navy text-white p-8 md:p-14 shadow-xl border border-brand-gold/30">
          {/* Subtle Ambient Gold Glow */}
          <div
            className="absolute -right-20 -top-20 w-80 h-80 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            {/* Prominent Bee Gold Vertical Bar */}
            <div
              className="w-1.5 self-stretch bg-brand-gold rounded-full min-h-[48px] md:min-h-[110px] shrink-0"
              aria-hidden="true"
            />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-brand-gold uppercase tracking-widest font-semibold">
                  Our Mission
                </span>
                <div className="h-px w-10 bg-brand-gold/40" />
              </div>

              <blockquote className="text-xl sm:text-2xl md:text-3xl text-white font-normal leading-relaxed tracking-tight">
                &ldquo;We eliminate the artificial divide between hiring talent and building software. By pairing elite domain specialists with end-to-end engineering pods, we help ambitious global enterprises scale without friction, technical debt, or vendor handoffs.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
