import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function WhyChooseUsSection() {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <ScrollReveal>
            <span className="inline-block text-gold-muted font-label-sm text-label-sm uppercase tracking-wider mb-4">WHY CHOOSE US</span>
            <h2 className="font-headline-xl text-headline-xl text-navy-deep mb-6">
              Experienced <span className="font-bold">Engineers Committed To Quality and Client</span> Success Always
            </h2>
            <p className="text-on-surface-variant text-body-lg mb-8">
              We bring unparalleled expertise and dedication to every project, ensuring scalable, secure, and innovative solutions tailored to your enterprise needs.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <ScrollReveal delay={0.1}>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gold-muted">verified</span>
                <span className="font-title-md text-sm font-semibold text-primary">Proven Track Record</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gold-muted">speed</span>
                <span className="font-title-md text-sm font-semibold text-primary">Fast Delivery</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gold-muted">support_agent</span>
                <span className="font-title-md text-sm font-semibold text-primary">24/7 Support</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gold-muted">psychology</span>
                <span className="font-title-md text-sm font-semibold text-primary">Top 1% Talent</span>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={0.5}>
            <div className="flex items-center gap-6">
              <Link className="bg-navy-deep text-white font-title-md text-title-md px-8 py-3 rounded hover:bg-primary hover:scale-105 transition-all" href="#">
                More About Us
              </Link>
              <div className="flex items-center gap-4 border-l-2 border-outline-variant/30 pl-6">
                <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-gold-muted">format_quote</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">"Outstanding partnership."</p>
                  <p className="text-xs text-on-surface-variant">- Natalie R., CTO</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
        {/* Right */}
        <div className="relative">
          <ScrollReveal delay={0.2} yOffset={40}>
            <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg relative">
              <Image
                alt="Enterprise Tech"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuK5StJhmKHBkiBsWv_JlZgzYOL9eHUwLuU-Btnn6W01xEk-DLHlh8kNKXErXCOOj_zdUri_ZsLQGcZ2bdfAiEHUHR3Ul9V2Su6YnQDKGYMhz1SRaHozWTRU89ySMZZfU7A1NWlsP2FeG99G25ocKuS4QpeyDZoDTq5WyA4uCnoXhd19gpNcKjVCp0EYE9t1PqXn1fn8mRkNHklfBaUDqnx0C5eM8W42VyZ_B6VohvM1PAcI-PdO4yyAAAzaZDPMgPFQ2J8HBNDpc"
                fill
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.4} yOffset={20} className="absolute -top-8 -right-8 w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white hidden md:block">
            <Image
              alt="Tablet"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-aUbXyG3z3NNKhC56m_hG6SHhRl8Ak2phBG7hnZ7YAW357DGXBeGgFbPpkg508ZVA8YnTXU-xy49mPrmKXFOecNOB7tDWAPXSg9YG7MJ2U8494ig00q7x2Juv8e7vbwWwHnXp3CZrT9jXabTf-65e-2uIZQv5ab9oH21V1Mtena5fHU_7s_Xetk-1NiSL2ytT2gDbi2qMCJEmwv3ZIU3UAvZlG282mafuhVC-Fj1LM331CT7-s8EKssdF9AxCUCt1UfGNIxX1IGQ"
              fill
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
