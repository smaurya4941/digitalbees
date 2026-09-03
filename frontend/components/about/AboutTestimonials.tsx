import ScrollReveal from "@/components/ui/ScrollReveal";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function AboutTestimonials() {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto bg-white">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        
        {/* Left Column: Heading & Rating */}
        <div className="w-full lg:w-1/2">
          <ScrollReveal>
            <div className="flex items-center gap-2 mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">
                TESTIMONIALS
              </span>
            </div>
            
            <h2 className="text-[40px] md:text-[48px] leading-[1.2] text-ink tracking-tight mb-10">
              Reliable, <span className="font-bold">Professional,<br/> And Truly Cared About</span><br/> Every Detail
            </h2>

            <div className="bg-[#F9FAFB] rounded-2xl p-6 md:p-8 inline-flex items-center gap-6 shadow-sm border border-black/5">
              <span className="text-5xl font-black text-ink tracking-tighter">4.9</span>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1 text-[#FACC15]">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-semibold text-ink-muted"><span className="text-[#FACC15]">3K+</span> Satisfied Customers</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Quote & Navigation */}
        <div className="w-full lg:w-1/2 flex flex-col pt-4">
          <ScrollReveal delay={0.2}>
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 rounded-full bg-[#FACC15] flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 10C9 12.2091 7.20914 14 5 14C2.79086 14 1 12.2091 1 10C1 7.79086 2.79086 6 5 6C7.20914 6 9 7.79086 9 10Z"/>
                  <path d="M23 10C23 12.2091 21.2091 14 19 14C16.7909 14 15 12.2091 15 10C15 7.79086 16.7909 6 19 6C21.2091 6 23 7.79086 23 10Z"/>
                  <path d="M5 14L5 18C5 19.1046 5.89543 20 7 20" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M19 14L19 18C19 19.1046 19.8954 20 21 20" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              
              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full bg-transparent border border-[#FACC15]/40 text-[#FACC15] flex items-center justify-center transition-colors hover:bg-[#FACC15] hover:text-white">
                  <ArrowLeft size={20} strokeWidth={1.5} />
                </button>
                <button className="w-12 h-12 rounded-full bg-transparent border border-[#FACC15]/40 text-[#FACC15] flex items-center justify-center transition-colors hover:bg-[#FACC15] hover:text-white">
                  <ArrowRight size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>
            
            <p className="text-[22px] leading-relaxed text-ink font-medium max-w-xl">
              Building an internal team used to be expensive and time-consuming. The Digital Bees solved our staffing needs globally, allowing us to scale our content and ad creative teams seamlessly without any hiring or retention headaches.
            </p>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
