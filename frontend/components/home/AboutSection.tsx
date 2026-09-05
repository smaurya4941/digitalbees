import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Home, Check } from "lucide-react";

export default function AboutSection() {
  const checkmarks = [
    "Pre-Trained Talent Pool",
    "15+ Years Staffing Experience",
    "Full-Time Commitment",
    "AI-Driven Strategies"
  ];

  const cards = [
    {
      title: "GLOBAL FOUNDATION",
      value: "15+\nYears",
      sub: "In Tech Staffing\nExcellence"
    },
    {
      title: "COMMITMENT MODEL",
      value: "100%",
      sub: "Dedicated Brand\nResources"
    },
    {
      title: "DELIVERY CAPABILITY",
      value: "Global",
      sub: "Serving India, UAE,\nEurope & US"
    }
  ];

  return (
    <section className="w-full flex flex-col lg:flex-row bg-[#2B2222]">
      
      {/* Left Content: Image (Full Bleed on Left) */}
      <div className="w-full lg:w-[45%] h-[400px] lg:h-auto relative">
        <ScrollReveal className="h-full">
          <div className="w-full h-full relative">
            <Image
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
              alt="Golden skyscrapers"
              fill
            />
            {/* Dark overlay to blend slightly with the right side if needed */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#2B2222]/50 lg:hidden"></div>
          </div>
        </ScrollReveal>
      </div>

      {/* Right Content */}
      <div className="w-full lg:w-[55%] py-12 lg:py-20 px-6 sm:px-8 lg:px-20 flex flex-col justify-center">
        <ScrollReveal delay={0.1}>
          
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6">
            <Home size={16} strokeWidth={2.5} className="text-[#FACC15]" />
            <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">
              ABOUT THE COMPANY
            </span>
          </div>
          
          {/* Headline */}
          <h2 className="text-[36px] md:text-[44px] leading-[1.2] text-white tracking-tight mb-8">
            We Are A <span className="font-bold">Next-Gen Digital Workforce</span> Fully Invested In Your Growth
          </h2>
          
          {/* Paragraph */}
          <p className="text-[15px] text-gray-400 leading-relaxed mb-10 max-w-3xl">
            The Digital Bees is a strategic unit of Teambees Corp, built to bridge the gap between talent and opportunity. Backed by a 15-year foundation in global tech staffing and our EdTech ecosystem, Techiegigs, we build high-performing digital growth engines for organizations worldwide.
          </p>

          {/* Checkmarks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 mb-12">
            {checkmarks.map((text, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Check size={16} className="text-[#FF7A59]" strokeWidth={3} />
                </div>
                <span className="text-white text-[15px] font-bold tracking-wide">{text}</span>
              </div>
            ))}
          </div>

          {/* 3 Bottom Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {cards.map((card, i) => (
              <ScrollReveal key={i} delay={0.2 + (0.1 * i)} yOffset={20}>
                <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-dashed border-white/20 p-6 rounded-2xl flex flex-col h-full hover:bg-white/[0.05] transition-colors">
                  <div className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-6">
                    {card.title}
                  </div>
                  <div className="text-white text-[28px] sm:text-[32px] md:text-[36px] font-extrabold mb-4 tracking-tight whitespace-pre-line leading-[1.1]">
                    {card.value}
                  </div>
                  <div className="text-gray-400 text-[13px] leading-relaxed whitespace-pre-line">
                    {card.sub}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
        </ScrollReveal>
      </div>
      
    </section>
  );
}
