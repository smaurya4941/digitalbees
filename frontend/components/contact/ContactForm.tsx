"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import { clientEnv } from "@/config/environment";
import dynamic from "next/dynamic";
import { useState } from "react";

const Map = dynamic(() => import("@/components/contact/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-[#F3F4F6] animate-pulse rounded-[2rem]" />
  ),
});

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    const formData = new FormData(e.currentTarget);
    
    const role = formData.get('role');
    const projectInfo = formData.get('message');
    
    const data = {
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      company: formData.get('company'),
      form_type: 'contact',
      message: `Role: ${role}\n\nProject Info: ${projectInfo}`
    };

    try {
      const apiBase = clientEnv.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
      const res = await fetch(`${apiBase}/leads`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        const errText = await res.text();
        console.error('API returned non-ok status:', res.status, errText);
        throw new Error('Failed to submit');
      }
      setStatus('success');
      e.currentTarget.reset();
    } catch (err) {
      setStatus('error');
    }
  };

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

            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                Thank you for your message. We will get back to you shortly!
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                Something went wrong. Please try again later.
              </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input 
                    name="full_name"
                    required
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full bg-[#F3F4F6] text-ink px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#FACC15] transition-shadow text-[14px]"
                  />
                </div>
                <div>
                  <input 
                    name="email"
                    required
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
                    name="company"
                    type="text" 
                    placeholder="Company Name / Website URL" 
                    className="w-full bg-[#F3F4F6] text-ink px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#FACC15] transition-shadow text-[14px]"
                  />
                </div>
                <div>
                  <select 
                    name="role"
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
                  name="message"
                  required
                  placeholder="Tell us about your project or hiring timeline..." 
                  rows={5}
                  className="w-full bg-[#F3F4F6] text-ink px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#FACC15] transition-shadow text-[14px] resize-y"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <button 
                  type="submit"
                  disabled={status === 'submitting'}
                  className="bg-black text-white px-8 py-4 rounded-xl font-bold text-[15px] hover:bg-black/80 transition-colors shadow-lg shadow-black/10 disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Submitting...' : 'Request Talent Proposal'}
                </button>
              </div>

            </form>
          </ScrollReveal>
        </div>

        {/* Right Column - Map */}
        <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-auto mt-8 lg:mt-0 z-0">
          <ScrollReveal delay={0.2}>
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.1)] z-0">
              <Map />
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
