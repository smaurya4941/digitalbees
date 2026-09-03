import ScrollReveal from "@/components/ui/ScrollReveal";
import Link from "next/link";

export default function ContactHero() {
  return (
    <section className="bg-[#FAF7F2] py-24 px-margin-mobile md:px-margin-desktop rounded-b-[3rem] md:rounded-b-[5rem] relative overflow-hidden">
      
      {/* Subtle dot pattern accent from screenshot */}
      <div className="absolute top-12 left-12 md:top-24 md:left-24 opacity-80">
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
          <circle cx="6" cy="6" r="3" fill="#FACC15" />
          <circle cx="22" cy="6" r="3" fill="#FACC15" />
          <circle cx="38" cy="6" r="3" fill="#FACC15" />
          <circle cx="54" cy="6" r="3" fill="#FACC15" />
          
          <circle cx="6" cy="20" r="3" fill="#FACC15" />
          <circle cx="22" cy="20" r="3" fill="#FACC15" />
          <circle cx="38" cy="20" r="3" fill="#FACC15" />
          <circle cx="54" cy="20" r="3" fill="#FACC15" />

          <circle cx="6" cy="34" r="3" fill="#FACC15" />
          <circle cx="22" cy="34" r="3" fill="#FACC15" />
          <circle cx="38" cy="34" r="3" fill="#FACC15" />
          <circle cx="54" cy="34" r="3" fill="#FACC15" />
        </svg>
      </div>

      <div className="max-w-container-max mx-auto text-center relative z-10 pt-10">
        <ScrollReveal>
          <h1 className="text-[48px] md:text-[64px] font-bold text-ink tracking-tight mb-4">
            Contact Us
          </h1>
          <div className="flex items-center justify-center gap-2 text-[14px] font-bold tracking-widest text-[#FACC15]">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="text-black text-[10px]">»</span>
            <span className="text-black">Contact Us</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
