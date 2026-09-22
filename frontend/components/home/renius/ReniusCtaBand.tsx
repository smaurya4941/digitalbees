import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ReniusCtaBand() {
  return (
    <section className="py-20 bg-[#0B1F3A] text-white relative overflow-hidden">
      {/* Subtle Background Lighting Orbs */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#C6963A]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-[#132B4F]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#D8A74A] font-mono text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-[#C6963A]" />
              <span>HIGH-VELOCITY DELIVERY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Let&apos;s build your capability engine.
            </h2>

            <p className="text-base text-slate-300">
              Partner with TeamBees to accelerate digital innovation. 48-hour shortlist turnaround,
              pre-vetted senior pods, and guaranteed delivery SLAs.
            </p>
          </div>

          {/* Circular Rotating Badge-Button Device (Renius Style) */}
          <div className="shrink-0 flex items-center justify-center">
            <Link
              href="/contact-us"
              className="group relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-[#D8A74A] to-[#C6963A] text-[#0B1F3A] p-2 flex flex-col items-center justify-center text-center shadow-2xl hover:scale-105 transition-all"
            >
              {/* Spinning circular border accent */}
              <div className="absolute inset-1 rounded-full border-2 border-dashed border-[#0B1F3A]/30 animate-spin-slow pointer-events-none" />

              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#0B1F3A]/70 mb-1">
                GET STARTED
              </span>
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-tight text-[#0B1F3A] px-2 leading-tight">
                Book Consultation
              </span>
              <div className="mt-2 w-7 h-7 rounded-full bg-[#0B1F3A] text-[#C6963A] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
