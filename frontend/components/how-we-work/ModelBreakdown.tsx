import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ModelBreakdown() {
  const models = [
    {
      num: "01",
      pillText: "Powered by Teambees Corp",
      pillBg: "bg-[#F9F6F0]",
      pillTextColor: "text-ink",
      title: "Digital Workforce Solutions",
      description: "Backed by over 15 years of deep industry experience in global tech staffing, providing a rock-solid foundation for talent sourcing and intelligence."
    },
    {
      num: "02",
      pillText: "Powered by Techiegigs",
      pillBg: "bg-[#FACC15]",
      pillTextColor: "text-ink",
      title: "AI-Powered Learning Ecosystem",
      description: "Continuous, cutting-edge training in AI-driven strategies and advanced digital tools, ensuring every marketing professional is performance-ready before deployment."
    },
    {
      num: "03",
      pillText: "Driven by The Digital Bees",
      pillBg: "bg-[#F9F6F0]",
      pillTextColor: "text-ink",
      title: "Extended In-House Teams",
      description: "Delivering execution-driven digital excellence and scalability, seamlessly acting as a high-performing extension of your core business operations."
    }
  ];

  return (
    <section className="bg-white py-24 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">
                OUR MODEL BREAKDOWN
              </span>
            </div>
            <h2 className="text-[36px] md:text-[44px] leading-[1.2] text-ink tracking-tight max-w-4xl mx-auto">
              The Powerful <span className="font-bold">Synergy of Staffing</span><br/>
              <span className="font-bold">Intelligence</span> and AI-Driven Execution
            </h2>
          </div>
        </ScrollReveal>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {models.map((model, index) => (
            <ScrollReveal key={index} delay={0.1 * (index + 1)}>
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-black/5 h-full flex flex-col hover:-translate-y-2 transition-transform duration-300">
                
                {/* Top Row: Number & Pill */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 bg-black rounded-xl text-white font-bold text-[22px] flex items-center justify-center shadow-md">
                    {model.num}
                  </div>
                  <div className={`${model.pillBg} ${model.pillTextColor} px-4 py-2 rounded-full text-[12px] font-bold tracking-wide`}>
                    {model.pillText}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-ink font-bold text-[22px] mb-4 leading-tight">
                  {model.title}
                </h3>
                <p className="text-ink-muted text-[15px] leading-relaxed flex-grow">
                  {model.description}
                </p>
                
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
