import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import RotatingBadge from "@/components/ui/RotatingBadge";

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="absolute left-0 top-32 hidden lg:block"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter relative z-10 pl-0 lg:pl-16">
        <div className="col-span-1 lg:col-span-8 space-y-6">
          <ScrollReveal>
            <span className="inline-block text-gold-muted font-label-sm text-label-sm uppercase tracking-wider">
              Talent + Technology
            </span>
            <h1 className="font-display-lg text-display-lg text-primary max-w-4xl">
              Expert <span className="font-bold">Engineering Teams For Enterprise</span> & Digital Transformation
            </h1>
          </ScrollReveal>
        </div>
        <div className="col-span-1 lg:col-span-4 flex items-center justify-start lg:justify-end mt-8 lg:mt-0">
          <ScrollReveal delay={0.2}>
            <RotatingBadge />
          </ScrollReveal>
        </div>
      </div>
      {/* Hero Image */}
      <ScrollReveal delay={0.3} yOffset={50}>
        <div className="mt-16 w-full h-[60vh] relative z-0 rounded-[2rem]">
          <Image
            className="w-full h-full object-cover rounded-[2rem] shadow-sm"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEPCdue5nTpfie_At2ijMW01kDtuwhXTFt824mpkXrjUnBXHgBSv0kLSPyb4TCPaflw1M-YEOnvRPqiOKOxL9I7hae7lv1yNMXagp3E2xWqBwZy6EjG9GFFqmmAT3-YFGCOmAkRBiaxSWgP9sO0ti10Yw2irN-uJG-IE1B7gaRwp2ml0lZ3N2RooWi4lyaigPOl7exMtAtpApcaIt7KSaJlMV75RYmV9CpDqox2woqdSLIdouPQ_BlwuqC_iuntInsRiEWQUAgqKV4nQ"
            alt="A massive, high-fidelity corporate office interior"
            fill
            priority
          />
          <div className="absolute bottom-8 left-0 w-full px-8 grid grid-cols-1 md:grid-cols-3 gap-6 z-20">
            <div className="bg-glass-dark backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-lg flex flex-col items-start text-white hover:-translate-y-2 hover:bg-glass-dark/90 transition-all duration-300">
              <div className="w-10 h-10 bg-gold-muted/20 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-gold-muted" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
              </div>
              <h3 className="font-title-md text-title-md mb-2">Top-Tier Talent</h3>
              <p className="text-surface-variant text-sm mb-6 flex-grow">Access the top 1% of engineering professionals vetted for enterprise scale.</p>
              <Link className="text-secondary-fixed text-sm font-semibold hover:text-white transition-colors flex items-center gap-1 group" href="#">
                Discover More <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className="bg-glass-dark backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-lg flex flex-col items-start text-white hover:-translate-y-2 hover:bg-glass-dark/90 transition-all duration-300">
              <div className="w-10 h-10 bg-gold-muted/20 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-gold-muted" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
              </div>
              <h3 className="font-title-md text-title-md mb-2">Production AI Agents</h3>
              <p className="text-surface-variant text-sm mb-6 flex-grow">Deploy custom AI agents integrated directly into your production workflows.</p>
              <Link className="text-secondary-fixed text-sm font-semibold hover:text-white transition-colors flex items-center gap-1 group" href="#">
                Discover More <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className="bg-glass-dark backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-lg flex flex-col items-start text-white hover:-translate-y-2 hover:bg-glass-dark/90 transition-all duration-300">
              <div className="w-10 h-10 bg-gold-muted/20 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-gold-muted" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
              </div>
              <h3 className="font-title-md text-title-md mb-2">End-to-End Delivery</h3>
              <p className="text-surface-variant text-sm mb-6 flex-grow">Full lifecycle management from initial architecture to final deployment.</p>
              <Link className="text-secondary-fixed text-sm font-semibold hover:text-white transition-colors flex items-center gap-1 group" href="#">
                Discover More <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
