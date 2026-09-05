import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";

const StarOutlineIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-black/10">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function AboutUsHero() {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto bg-white">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        
        {/* Left Content: Image */}
        <div className="w-full lg:w-[45%]">
          <ScrollReveal>
            <div className="w-full h-[400px] md:h-[600px] lg:h-[700px] relative rounded-[2rem] overflow-hidden shadow-lg">
              <Image
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                alt="Digital Bees Team working in office"
                fill
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center">
          <ScrollReveal delay={0.1}>
            <div className="flex items-center gap-2 mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FACC15" xmlns="http://www.w3.org/2000/svg" className="text-[#FACC15]">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">
                ABOUT US
              </span>
            </div>
            
            <h2 className="text-[32px] md:text-[44px] leading-[1.2] text-ink tracking-tight mb-6">
              At The Digital Bees, <span className="font-bold">our commitment to bridging the gap between digital workforce solutions</span> and exceptional talent is unwavering.
            </h2>
            
            <p className="text-[15px] text-ink-muted leading-relaxed mb-12 max-w-2xl">
              We specialize in delivering highly skilled, pre-trained, and performance-ready digital marketing professionals to businesses across the globe. Backed by a 15-year foundation in global tech staffing, we build digital growth engines for organizations rather than just providing basic resources.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "STAFFING FOUNDATION", value: "15+ Years", sub: "Industry Expertise" },
              { title: "GLOBAL PRESENCE", value: "3 Offices", sub: "Delhi, Gurgaon &\nChicago" },
              { title: "TALENT INTEGRATION", value: "100%", sub: "Dedicated In-house\nResources" }
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={0.2 + (0.1 * i)} yOffset={20}>
                <div className="bg-gradient-to-b from-[#F9F6F0] to-[#F2EAE0] p-6 rounded-2xl flex flex-col h-full shadow-sm hover:-translate-y-1 transition-transform border border-black/5">
                  <div className="text-ink font-bold text-[10px] uppercase tracking-widest mb-4">{stat.title}</div>
                  <div className="flex gap-1 mb-6">
                    <StarOutlineIcon />
                    <StarOutlineIcon />
                    <StarOutlineIcon />
                    <StarOutlineIcon />
                  </div>
                  <div className="text-ink text-[28px] font-extrabold mb-1 tracking-tight">{stat.value}</div>
                  <div className="text-ink-muted text-[13px] leading-relaxed whitespace-pre-line">{stat.sub}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
