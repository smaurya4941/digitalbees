"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import RotatingBadge from "@/components/ui/RotatingBadge";

const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", // Data dashboard
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop", // Tech workplace
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop"  // Team meeting
];

const CheckmarkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FACC15"/>
    <path d="M7.5 12L10.5 15L16.5 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-24 pb-32 overflow-hidden px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="absolute left-0 top-32 hidden lg:block"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter relative z-10 pl-0 lg:pl-16">
        <div className="col-span-1 lg:col-span-8 flex flex-col justify-center">
          <ScrollReveal className="space-y-6">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">
                NEXT-GENERATION DIGITAL WORKFORCE SOLUTIONS
              </span>
            </div>
            <h1 className="text-[42px] md:text-[64px] text-primary max-w-4xl leading-[1.1] tracking-tight">
              <span className="font-medium">Build</span> <span className="font-bold">Your Digital Team.</span><br />
              <span className="font-bold">The Smarter</span> <span className="font-light">Way.</span>
            </h1>
            <p className="text-lg text-ink-muted max-w-3xl leading-relaxed">
              Stop burning budget on underperforming agencies or unreliable freelancers. Get highly skilled, pre-trained, and performance-ready digital marketing professionals dedicated exclusively to growing your brand.
            </p>
          </ScrollReveal>
        </div>
        <div className="col-span-1 lg:col-span-4 flex items-center justify-start lg:justify-end mt-8 lg:mt-0">
          <ScrollReveal delay={0.2}>
            <RotatingBadge size="lg" />
          </ScrollReveal>
        </div>
      </div>
      
      {/* Hero Image Slider */}
      <ScrollReveal delay={0.3} yOffset={50}>
        <div className="mt-16 w-full h-[600px] md:h-[85vh] relative z-0 rounded-[2rem] overflow-hidden bg-black">
          {SLIDER_IMAGES.map((src, index) => (
            <div 
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                className="w-full h-full object-cover"
                src={src}
                alt={`Hero background slide ${index + 1}`}
                fill
                priority={index === 0}
              />
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
          ))}

          {/* Cards */}
          <div className="relative md:absolute bottom-0 md:bottom-8 left-0 w-full px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 z-20 mt-auto pb-12 md:pb-0 pt-32 md:pt-0">
            {/* Card 1 */}
            <div className="bg-[#1A1D20]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-start text-white transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <CheckmarkIcon />
                <h3 className="font-bold text-[17px] leading-tight">Pre-Trained & Deployment-<br/>Ready</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed font-medium">
                AI-trained marketing experts ready to execute from day one with zero onboarding delays.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-[#1A1D20]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-start text-white transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <CheckmarkIcon />
                <h3 className="font-bold text-[17px] leading-tight">Dedicated In-House Extension</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed font-medium">
                Full-time digital specialists working transparently and exclusively as part of your team.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-[#1A1D20]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-start text-white transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <CheckmarkIcon />
                <h3 className="font-bold text-[17px] leading-tight">Cost-Efficient & Scalable</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed font-medium">
                Eliminate heavy agency overheads and easily scale your team based on active business needs.
              </p>
            </div>
          </div>

          {/* Slider Pagination Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {SLIDER_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-[#FACC15] w-6" : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
