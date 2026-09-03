import ScrollReveal from "@/components/ui/ScrollReveal";
import { Award } from "lucide-react";
import Link from "next/link";

export default function HowWeWorkHero() {
  const steps = [
    { num: "01", title: "Requirement Understanding" },
    { num: "02", title: "Talent Mapping" },
    { num: "03", title: "Screening & Selection" },
    { num: "04", title: "Deployment" },
    { num: "05", title: "Performance Monitoring" },
  ];

  return (
    <>
      {/* Workflow Steps Section */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-white">
        <div className="max-w-container-max mx-auto">
          
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">
                  HOW WE WORK
                </span>
              </div>
              <h2 className="text-[40px] md:text-[48px] leading-[1.2] text-ink tracking-tight">
                Simple, <span className="font-bold">Transparent, and</span><br/>
                <span className="font-bold">Scalable</span> Talent Deployment
              </h2>
            </div>
          </ScrollReveal>

          {/* Steps container */}
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <ScrollReveal key={step.num} delay={0.1 * (index + 1)}>
                <div className="flex items-center gap-4 bg-white border border-dashed border-gray-300 rounded-full pr-8 pl-2 py-2 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                  {/* Yellow Circle Icon */}
                  <div className="w-16 h-16 rounded-full bg-[#FACC15] flex items-center justify-center flex-shrink-0">
                    <Award size={28} className="text-ink" strokeWidth={2} />
                  </div>
                  {/* Text Content */}
                  <div className="flex flex-col">
                    <span className="text-[#FACC15] text-[13px] font-bold tracking-wider mb-0.5">
                      Step {step.num}
                    </span>
                    <h3 className="text-ink font-bold text-[16px] whitespace-nowrap">
                      {step.title}
                    </h3>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
