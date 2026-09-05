import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ArrowUpRight } from "lucide-react";

export default function ServicesDeployment() {
  const features = [
    {
      title: "Pre-Trained Talent",
      description: "Rigorously trained through our AI ecosystem.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20v-6M6 20V10M18 20V4"/>
        </svg>
      )
    },
    {
      title: "Cost Efficiency",
      description: "Eliminate agency overheads and hiring costs.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>
        </svg>
      )
    },
    {
      title: "Full Commitment",
      description: "Dedicated resources working exclusively for you.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/>
        </svg>
      )
    },
    {
      title: "Performance-Driven",
      description: "Focused on execution and measurable results.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      )
    }
  ];

  return (
    <section className="bg-[#F9FAFB] py-24 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Left Column: Content */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <ScrollReveal>
            <div className="flex items-center gap-2 mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">
                WHY WORK WITH US
              </span>
            </div>
            
            <h2 className="text-[32px] md:text-[48px] leading-[1.2] text-ink tracking-tight mb-6">
              Dedicated Digital <span className="font-bold">Experts Committed To Ownership,</span> Execution, and Growth
            </h2>
            
            <p className="text-[15px] text-ink-muted leading-relaxed mb-12 max-w-md">
              In an era where digital presence defines success, companies need more than just standard service providers. We bridge the gap by providing performance-ready marketing professionals who operate with full accountability.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 mb-12">
            {features.map((feature, i) => (
              <ScrollReveal key={i} delay={0.1 * (i + 1)}>
                <div className="flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center text-ink mb-4 shadow-sm">
                    {feature.icon}
                  </div>
                  <h4 className="text-[15px] font-bold text-ink mb-2">{feature.title}</h4>
                  <p className="text-[14px] text-ink-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="flex items-center gap-2 mt-4">
              <button className="bg-black text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-black/80 transition-colors">
                See Our Deployment Process
              </button>
              <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                <ArrowUpRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Image */}
        <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-[600px] mt-8 lg:mt-0">
          <ScrollReveal delay={0.2}>
            <div className="w-full h-full absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr9SNXYFPQ6wPzBuetoKUOTNsjOdqafbe6bCISTzQanOHq_TpBpFu9oYEu-8ytjT9Oy4lrjouUgZ87LF6iLWidX5RYaIbiXlmf5vFViGPY_dI34i-IofgjEG37RO6MxqyUiGK5_fRk7Cb6uE9LDFJBUpH_7cciJSsenRw3n7F2invY3xtnaPNioJZJRm_Msia6AZLNihJZz0khzNHLJCSZa15RvP4Uw4urydRGJqYs22MHOBCUHMeua2KDYINOSMDx6yjTMFaxWuM"
                alt="Digital Experts working"
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
