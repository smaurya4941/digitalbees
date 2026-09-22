import Link from 'next/link';
import { ArrowRight, Building, CheckCircle2, Cpu, Layers, Quote, Shield } from 'lucide-react';

const WHY_CHOOSE_ITEMS = [
  {
    icon: Building,
    title: 'Enterprise & GCC focus',
    desc: 'Dedicated experience supporting global capability centers and multi-jurisdiction enterprise runtimes.',
  },
  {
    icon: Shield,
    title: 'AI-enabled, human-verified selection',
    desc: 'Every candidate undergoes 5-gate screening with deep technical panel interviews before client submittal.',
  },
  {
    icon: Cpu,
    title: 'Technology and engineering breadth',
    desc: 'Cross-functional depth across AI swarms, ServiceNow, cloud engineering, QA, and commodity CTRM.',
  },
  {
    icon: Layers,
    title: 'Flexible engagement models',
    desc: 'Rapid staff augmentation, autonomous managed pods, or turnkey deliverables tailored to your governance.',
  },
];

export default function ReniusWhyChooseUs() {
  return (
    <section className="py-20 bg-[#F8FAFD] border-b border-[#CBDFF2] relative overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Content + 4-item Icon List + CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FB] border border-[#CBDFF2]">
                <span className="w-2 h-2 rounded-full bg-[#9E6D18]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E6D18]">
                  WHY CHOOSE US
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1F3A] tracking-tight">
                The scale and flexibility <br />
                <span className="text-[#9E6D18]">enterprise teams need.</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-2">
                Whether deploying a single specialist within 48 hours or standing up a full-scale
                sovereign capability pod, our delivery architecture aligns directly with your
                security and operational roadmaps.
              </p>
            </div>

            {/* 4-Item Icon List */}
            <div className="space-y-4 pt-2">
              {WHY_CHOOSE_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4 p-3.5 rounded-xl bg-white border border-[#CBDFF2] shadow-xs">
                    <div className="w-10 h-10 rounded-lg bg-[#EAF2FB] text-[#0B1F3A] flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-[#9E6D18]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F3A]">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D8A74A] to-[#C6963A] text-[#0B1F3A] font-extrabold text-xs uppercase tracking-wider shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <span>More About Us</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Stage with Reserved Leadership Quote Card Slot */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B1F3A] via-[#132B4F] to-[#1E3A60] p-8 sm:p-12 text-white shadow-xl relative min-h-[440px] flex flex-col justify-between">
              {/* Gold Grid Texture */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(198,150,58,0.25)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#D8A74A] font-mono text-xs font-bold">
                  <Quote className="h-3.5 w-3.5 text-[#C6963A]" />
                  <span>EXECUTIVE COMMITMENT</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  &ldquo;We measure success by production deployment, not just headcount placed.&rdquo;
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Our pod leadership takes end-to-end accountability for code quality, delivery velocity,
                  and architectural security across all six operating jurisdictions.
                </p>
              </div>

              {/* Reserved Quote Card Slot (Transparent handling of pending verified quote per spec) */}
              <div className="relative z-10 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 mt-6 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">TeamBees Practice Leadership</div>
                  <div className="text-xs text-white/70">Executive Committee · Verified Pod Governance</div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>GOVERNED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
