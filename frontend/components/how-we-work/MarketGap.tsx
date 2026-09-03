import ScrollReveal from "@/components/ui/ScrollReveal";
import { X } from "lucide-react";
import Link from "next/link";

export default function MarketGap() {
  const challenges = [
    {
      title: "Traditional Agencies",
      description: "Lack real ownership, juggle multiple clients simultaneously, and offer limited workflow transparency with high overhead costs."
    },
    {
      title: "Independent Freelancers",
      description: "Prone to inconsistent availability, sudden communication drops, and unpredictable quality control or scalability challenges."
    },
    {
      title: "Traditional Internal Hiring",
      description: "Involves highly expensive recruitment cycles, long training delays, high infrastructure liabilities, and severe retention risks."
    }
  ];

  return (
    <section className="bg-black py-24 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-24">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">
                THE MARKET GAP
              </span>
            </div>
            <h2 className="text-[36px] md:text-[48px] leading-[1.2] text-white tracking-tight">
              Why Traditional <span className="font-bold">Models Fail &</span><br/>
              How We Fix It
            </h2>
          </div>
        </ScrollReveal>

        {/* Content Split */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column - Challenges */}
          <div className="w-full lg:w-[45%] flex flex-col gap-6">
            <ScrollReveal>
              <h3 className="text-white text-[22px] font-bold mb-2">The Industry Challenges</h3>
            </ScrollReveal>

            {challenges.map((challenge, index) => (
              <ScrollReveal key={index} delay={0.1 * index}>
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 flex gap-6 hover:border-white/10 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                      <X size={14} className="text-white" strokeWidth={3} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-[18px] mb-2">{challenge.title}</h4>
                    <p className="text-gray-400 text-[14px] leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Vertical Divider (Hidden on mobile) */}
          <div className="hidden lg:block w-[2px] bg-[#FACC15] rounded-full my-12 opacity-80" />

          {/* Right Column - Intervention */}
          <div className="w-full lg:w-[55%] flex flex-col pt-8 lg:pt-16">
            <ScrollReveal delay={0.2}>
              <h4 className="text-[#FACC15] text-[20px] mb-4">Our Intervention</h4>
              <h3 className="text-white text-[28px] md:text-[32px] font-bold leading-tight mb-6">
                Your Own Dedicated Digital Team, Without Hiring Hassles.
              </h3>
              <p className="text-gray-400 text-[15px] leading-relaxed mb-10 max-w-xl">
                We bridge the industry gap by deploying fully vetted, AI-trained digital professionals who work exclusively as a full-time extension of your brand. You eliminate expensive recruitment liabilities while gaining absolute operational control, transparent workflows, and flexible scalability.
              </p>

              {/* Metrics Grid */}
              <div className="flex flex-wrap gap-4 mb-10">
                <div className="flex-1 min-w-[120px] bg-[#111] border border-[#FACC15]/30 rounded-xl p-6 text-center hover:border-[#FACC15] transition-colors">
                  <div className="text-[#FACC15] text-[28px] font-bold mb-1">100%</div>
                  <div className="text-gray-400 text-[13px]">Dedicated Focus</div>
                </div>
                <div className="flex-1 min-w-[120px] bg-[#111] border border-[#FACC15]/30 rounded-xl p-6 text-center hover:border-[#FACC15] transition-colors">
                  <div className="text-[#FACC15] text-[28px] font-bold mb-1">AI</div>
                  <div className="text-gray-400 text-[13px]">Pre-Trained Talent</div>
                </div>
                <div className="flex-1 min-w-[120px] bg-[#111] border border-[#FACC15]/30 rounded-xl p-6 text-center hover:border-[#FACC15] transition-colors">
                  <div className="text-[#FACC15] text-[28px] font-bold mb-1">0%</div>
                  <div className="text-gray-400 text-[13px]">Hiring Liabilities</div>
                </div>
              </div>

              {/* CTA */}
              <div>
                <Link 
                  href="#" 
                  className="inline-block bg-[#FACC15] text-black font-bold text-[14px] px-8 py-4 rounded-full hover:bg-white transition-colors shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                >
                  Explore Our 3-Pillar Ecosystem
                </Link>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
