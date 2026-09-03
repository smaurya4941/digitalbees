import ScrollReveal from "@/components/ui/ScrollReveal";
import Image from "next/image";
import Link from "next/link";

export default function AboutBanner() {
  return (
    <section className="py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <ScrollReveal>
        <div className="w-full relative overflow-hidden rounded-[2rem] md:rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl min-h-[200px]">
          
          {/* Background Image & Overlay */}
          <Image 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
            alt="Abstract background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#d97706]/95 via-[#f59e0b]/90 to-[#fbbf24]/85"></div>
          
          <h2 className="text-white text-[32px] md:text-[48px] leading-[1.2] tracking-tight max-w-3xl font-light relative z-10">
            Let&apos;s Build Your <span className="font-bold">High-Performing Digital Team</span> &ndash; Contact Us For A Consultation!
          </h2>
          
          <Link href="/contact" className="relative mt-8 md:mt-0 flex-shrink-0 group z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#FACC15] shadow-lg flex items-center justify-center relative overflow-hidden hover:scale-105 transition-transform">
              {/* Rotating text placeholder - in a real app you'd use SVG textPath for curved text */}
              <div className="absolute inset-0 animate-[spin_10s_linear_infinite] flex items-center justify-center">
                 <svg viewBox="0 0 100 100" width="90%" height="90%" className="text-white font-bold text-[10px] tracking-[0.3em] uppercase">
                  <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                  <text>
                    <textPath href="#circlePath" startOffset="0%">SCHEDULE A VISIT • SCHEDULE A VISIT • </textPath>
                  </text>
                </svg>
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/10 backdrop-blur-sm shadow-inner z-10 border border-white/20"></div>
            </div>
          </Link>
          
        </div>
      </ScrollReveal>
    </section>
  );
}
