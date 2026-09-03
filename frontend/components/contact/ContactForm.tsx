"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function ContactForm() {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-white">
      <div className="max-w-container-max mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Column - Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <ScrollReveal>
            <h2 className="text-[36px] md:text-[48px] leading-[1.2] text-ink tracking-tight mb-4">
              Let&apos;s Build <span className="font-bold">Your Digital</span> Workforce
            </h2>
            <p className="text-[15px] text-ink-muted leading-relaxed mb-12 max-w-md">
              Reach out to us to deploy pre-trained, performance-ready digital experts tailored to your business needs.
            </p>

            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full bg-[#F3F4F6] text-ink px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#FACC15] transition-shadow text-[14px]"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Work Email Address" 
                    className="w-full bg-[#F3F4F6] text-ink px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#FACC15] transition-shadow text-[14px]"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Company Name / Website URL" 
                    className="w-full bg-[#F3F4F6] text-ink px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#FACC15] transition-shadow text-[14px]"
                  />
                </div>
                <div>
                  <select 
                    className="w-full bg-[#F3F4F6] text-ink-muted px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#FACC15] transition-shadow text-[14px] appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled>What role are you looking to hire?</option>
                    <option value="marketing">Digital Marketing</option>
                    <option value="development">Web Development</option>
                    <option value="design">UI/UX Design</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Row 3 */}
              <div>
                <textarea 
                  placeholder="Tell us about your project or hiring timeline..." 
                  rows={5}
                  className="w-full bg-[#F3F4F6] text-ink px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#FACC15] transition-shadow text-[14px] resize-y"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <button 
                  type="submit"
                  className="bg-black text-white px-8 py-4 rounded-xl font-bold text-[15px] hover:bg-black/80 transition-colors shadow-lg shadow-black/10"
                >
                  Request Talent Proposal
                </button>
              </div>

            </form>
          </ScrollReveal>
        </div>

        {/* Right Column - Image */}
        <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-auto mt-8 lg:mt-0">
          <ScrollReveal delay={0.2}>
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.1)]">
              {/* Using the glowing orange texture from previous components as it perfectly matches the vibe */}
              <Image 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                alt="Digital Network Grid"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#f59e0b]/40 to-transparent mix-blend-overlay"></div>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
