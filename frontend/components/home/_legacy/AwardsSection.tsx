import ScrollReveal from "@/components/ui/ScrollReveal";

export default function AwardsSection() {
  return (
    <section className="py-24 bg-surface-ivory px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto text-center">
        <ScrollReveal>
          <span className="text-gold-muted font-bold tracking-[0.3em] uppercase text-label-sm">Our Recognition</span>
          <h2 className="text-navy-deep text-headline-lg font-bold mt-4 mb-16">
            Award-Winning <span className="text-gold-muted">Partnership Trusted By</span> Enterprises
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Award 1 */}
          <ScrollReveal delay={0.1}>
            <div className="bg-white rounded-full shadow-sm px-8 py-6 flex items-center gap-6 border border-outline-variant/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-gold-muted/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-gold-muted">workspace_premium</span>
              </div>
              <div className="text-left">
                <div className="text-gold-muted font-bold text-sm">2024</div>
                <div className="text-primary font-semibold">Top AI Integration Partner</div>
              </div>
            </div>
          </ScrollReveal>
          {/* Award 2 */}
          <ScrollReveal delay={0.2}>
            <div className="bg-white rounded-full shadow-sm px-8 py-6 flex items-center gap-6 border border-outline-variant/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-gold-muted/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-gold-muted">military_tech</span>
              </div>
              <div className="text-left">
                <div className="text-gold-muted font-bold text-sm">2023</div>
                <div className="text-primary font-semibold">Enterprise Excellence</div>
              </div>
            </div>
          </ScrollReveal>
          {/* Award 3 */}
          <ScrollReveal delay={0.3}>
            <div className="bg-white rounded-full shadow-sm px-8 py-6 flex items-center gap-6 border border-outline-variant/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-gold-muted/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-gold-muted">stars</span>
              </div>
              <div className="text-left">
                <div className="text-gold-muted font-bold text-sm">2024</div>
                <div className="text-primary font-semibold">Global Tech Leader</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
