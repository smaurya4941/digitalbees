import React from "react";
import Link from "next/link";
import { routes } from "@/config/routes";

interface PageHeaderProps {
  title: string;
  breadcrumb: string;
}

export default function PageHeader({ title, breadcrumb }: PageHeaderProps) {
  return (
    <div className="p-2 md:p-4">
      <section className="relative w-full bg-[#F4F0EB] rounded-[2.5rem] md:rounded-[3.5rem] pt-[130px] md:pt-[150px] pb-20 md:pb-28 overflow-hidden z-0 shadow-sm border border-black/5">
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        ></div>

        {/* Yellow Dots Decoration */}
        <div className="absolute left-[10%] top-[40%] hidden md:block opacity-80">
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="34" r="2" fill="#FACC15" />
            <circle cx="16" cy="34" r="2" fill="#FACC15" />
            <circle cx="11" cy="26" r="2" fill="#FACC15" />
            <circle cx="21" cy="26" r="2" fill="#FACC15" />
            <circle cx="26" cy="18" r="2" fill="#FACC15" />
            <circle cx="31" cy="26" r="2" fill="#FACC15" />
            <circle cx="36" cy="18" r="2" fill="#FACC15" />
            <circle cx="41" cy="10" r="2" fill="#FACC15" />
            <circle cx="46" cy="18" r="2" fill="#FACC15" />
            <circle cx="51" cy="10" r="2" fill="#FACC15" />
            <circle cx="56" cy="2" r="2" fill="#FACC15" />
          </svg>
        </div>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-[44px] md:text-[56px] font-bold text-ink mb-4 tracking-tight">
            {title}
          </h1>
          <div className="flex items-center gap-2 text-[14px] font-semibold tracking-wide">
            <Link href={routes.home()} className="text-[#FACC15] hover:underline">
              Home
            </Link>
            <span className="text-ink-muted text-[10px]">»</span>
            <span className="text-ink/70">{breadcrumb}</span>
          </div>
        </div>

      </section>
    </div>
  );
}
