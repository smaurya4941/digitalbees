import ScrollReveal from "@/components/ui/ScrollReveal";

export default function AdvantageSection() {
  return (
    <section className="py-24 bg-surface-container-low px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-gold-muted font-label-sm text-label-sm uppercase tracking-wider mb-4">The TeamBees Advantage</span>
            <h2 className="font-headline-xl text-headline-xl text-primary">
              Genuine <span className="font-bold">Partner In Every Aspect</span> Of Your Journey
            </h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <ScrollReveal delay={0.1}>
            <div className="bg-surface-ivory p-8 rounded-lg border border-outline-variant/50 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 h-full">
              <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">groups</span>
              </div>
              <h4 className="font-title-md text-title-md text-primary font-bold mb-3">Dedicated Teams</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Fully integrated pods that act as a seamless extension of your in-house engineering capabilities.</p>
            </div>
          </ScrollReveal>
          {/* Feature 2 */}
          <ScrollReveal delay={0.2}>
            <div className="bg-surface-ivory p-8 rounded-lg border border-outline-variant/50 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 h-full">
              <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">sync</span>
              </div>
              <h4 className="font-title-md text-title-md text-primary font-bold mb-3">Agile Delivery</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Iterative development cycles ensuring rapid time-to-market without compromising quality.</p>
            </div>
          </ScrollReveal>
          {/* Feature 3 */}
          <ScrollReveal delay={0.3}>
            <div className="bg-surface-ivory p-8 rounded-lg border border-outline-variant/50 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 h-full">
              <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">shield</span>
              </div>
              <h4 className="font-title-md text-title-md text-primary font-bold mb-3">Security First</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Enterprise-grade security protocols baked into every layer of our development lifecycle.</p>
            </div>
          </ScrollReveal>
          {/* Feature 4 */}
          <ScrollReveal delay={0.4}>
            <div className="bg-surface-ivory p-8 rounded-lg border border-outline-variant/50 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 h-full">
              <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">domain</span>
              </div>
              <h4 className="font-title-md text-title-md text-primary font-bold mb-3">Enterprise Scale</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Architectures designed to handle massive throughput and complex organizational requirements.</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
