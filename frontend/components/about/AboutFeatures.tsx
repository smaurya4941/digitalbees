import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerReveal";

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-1 flex-shrink-0">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function AboutFeatures() {
  const features = [
    {
      title: "Full Transparency",
      description: "Gain complete control over your dedicated resources and direct daily workflow integration.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#FACC15" className="transition-transform duration-300 group-hover:scale-110">
          <rect x="2" y="2" width="8" height="8" rx="1" />
          <rect x="14" y="2" width="8" height="8" rx="1" />
          <rect x="2" y="14" width="8" height="8" rx="1" />
          <rect x="14" y="14" width="8" height="8" rx="1" />
        </svg>
      )
    },
    {
      title: "Performance Tracking",
      description: "Continuous monitoring, quality checks, and regular upskilling upgrades via Techiegigs.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-1">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    },
    {
      title: "Rapid Deployment",
      description: "Swift onboarding into your workflow with quick replacement support to prevent disruption.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    },
    {
      title: "Flexible Scalability",
      description: "Effortlessly scale your digital workforce up or down based strictly on business needs.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-[#F9FAFB] py-24 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-2 mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">
              OUR FEATURES
            </span>
          </div>
          <h2 className="text-[32px] md:text-[48px] leading-[1.2] text-ink tracking-tight mb-16 max-w-2xl">
            Genuine <span className="font-bold">Partner In Every Aspect</span> Of Digital Growth
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20" delay={0.2}>
          {features.map((feature, i) => (
            <StaggerItem key={i}>
              <div className="flex flex-col group cursor-pointer">
                <div className="mb-6">{feature.icon}</div>
                <h4 className="text-[20px] font-bold text-ink mb-3 group-hover:text-[#FACC15] transition-colors duration-300">{feature.title}</h4>
                <p className="text-ink-muted text-[15px] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8" delay={0.3}>
          {/* Mission Card */}
          <StaggerItem>
            <div className="group bg-white rounded-[2rem] p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row min-h-[300px] border border-black/5 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-[#FACC15]/30 transition-all duration-500 cursor-pointer">
              <div className="w-full sm:w-[45%] relative min-h-[250px] rounded-2xl overflow-hidden shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                  alt="Mission"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="w-full sm:w-[55%] p-6 flex flex-col justify-center">
                <h3 className="text-[22px] font-bold text-ink mb-3 transition-colors duration-300 group-hover:text-[#FACC15]">Mission</h3>
                <p className="text-[14px] text-ink-muted leading-relaxed mb-6">
                  Empowering businesses globally with reliable, scalable, and pre-trained digital resources.
                </p>
                <ul className="space-y-3">
                  {["Pre-Trained Talent Pool", "Cost-Efficient Models", "Full-Time Commitment", "Scalable Team Setup", "Performance-Driven Approach"].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <CheckIcon />
                      <span className="text-[13px] font-semibold text-ink/80 pt-0.5">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </StaggerItem>

          {/* Vision Card */}
          <StaggerItem>
            <div className="group bg-white rounded-[2rem] p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row min-h-[300px] border border-black/5 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-[#FACC15]/30 transition-all duration-500 cursor-pointer">
              <div className="w-full sm:w-[45%] relative min-h-[250px] rounded-2xl overflow-hidden shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                  alt="Vision"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="w-full sm:w-[55%] p-6 flex flex-col justify-center">
                <h3 className="text-[22px] font-bold text-ink mb-3 transition-colors duration-300 group-hover:text-[#FACC15]">Vision</h3>
                <p className="text-[14px] text-ink-muted leading-relaxed mb-6">
                  Empowering global businesses with top-tier digital talent to unlock their true potential.
                </p>
                <ul className="space-y-3">
                  {["Global Delivery Capability", "AI-Powered Training Ecosystem", "Extended In-House Teams", "Complete Workflow Alignment", "Digital Growth Engines"].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <CheckIcon />
                      <span className="text-[13px] font-semibold text-ink/80 pt-0.5">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
