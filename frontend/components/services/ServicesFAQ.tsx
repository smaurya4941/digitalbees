"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Faq } from "@/types/practice";

/** General FAQs from the admin (GET /faqs). Renders nothing when none are published. */
export default function ServicesFAQ({ faqs }: { faqs: Faq[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section className="bg-black py-24 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <ScrollReveal>
          <div className="bg-[#F9FAFB] rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 lg:p-24 shadow-2xl relative overflow-hidden">
            
            <div className="flex flex-col items-center text-center mb-16">
              <div className="flex items-center gap-2 mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">
                  HAVE QUESTIONS?
                </span>
              </div>
              <h2 className="text-[32px] md:text-[48px] leading-[1.2] text-ink tracking-tight max-w-3xl">
                How We <span className="font-bold">Guarantee Continuous Workflow</span> & Quality Control
              </h2>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col gap-4">
              {faqs.map((faq, index) => {
                const isActive = activeIndex === index;
                
                return (
                  <div 
                    key={faq.id} 
                    className={`rounded-lg overflow-hidden transition-all duration-300 ${isActive ? 'bg-white shadow-md' : 'bg-[#1a1a1a]'}`}
                  >
                    <button
                      onClick={() => setActiveIndex(isActive ? null : index)}
                      className={`w-full flex items-center justify-between p-6 text-left transition-colors ${
                        isActive 
                          ? 'bg-[#FACC15] text-ink font-bold' 
                          : 'bg-[#1a1a1a] text-white font-semibold hover:bg-[#2a2a2a]'
                      }`}
                    >
                      <span className="text-[15px] md:text-[16px]">{faq.question}</span>
                      {isActive ? (
                        <ChevronUp size={20} className="flex-shrink-0 ml-4" />
                      ) : (
                        <ChevronDown size={20} className="flex-shrink-0 ml-4 opacity-70" />
                      )}
                    </button>
                    
                    <div 
                      className={`transition-all duration-300 ease-in-out ${
                        isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-6 text-ink-muted text-[15px] leading-relaxed border-t border-dashed border-black/10 bg-white">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
