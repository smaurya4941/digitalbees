"use client";
import { Play, ArrowRight } from "lucide-react";
import Link from "next/link";

interface RotatingBadgeProps {
  text?: string;
  icon?: "play" | "arrow";
  href?: string;
  size?: "md" | "lg";
}

export default function RotatingBadge({ 
  text = "PLAY VIDEO • PLAY VIDEO • ", 
  icon = "play",
  href,
  size = "md"
}: RotatingBadgeProps) {
  
  const sizeClasses = size === "md" ? "h-32 w-32" : "h-40 w-40";
  const textClasses = size === "md" ? "text-[10px]" : "text-[10px] tracking-[0.2em]";
  const btnClasses = size === "md" ? "h-12 w-12 bg-[#FACC15] text-ink" : "h-16 w-16 bg-[#FACC15] text-ink";
  
  const content = (
    <div className={`relative flex ${sizeClasses} items-center justify-center group cursor-pointer`}>
      <svg className="absolute inset-0 h-full w-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
        <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
        <text className={`fill-current ${icon === "play" ? "text-ink" : "text-ink"} ${textClasses} font-bold uppercase tracking-[2px]`}>
          <textPath href="#circlePath" startOffset="0%">{text}</textPath>
        </text>
      </svg>
      <div className={`absolute flex ${btnClasses} items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110`}>
        {icon === "play" ? <Play size={size === "md" ? 20 : 28} fill="currentColor" /> : <ArrowRight size={size === "md" ? 20 : 28} />}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  return content;
}
