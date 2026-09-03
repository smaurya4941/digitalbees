'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface InfiniteMarqueeProps {
  items: string[];
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

export function InfiniteMarquee({ items, className, speed = 'normal' }: InfiniteMarqueeProps) {
  const speedClass = {
    slow: 'animate-marquee-slow',
    normal: 'animate-marquee',
    fast: 'animate-marquee-fast',
  }[speed];

  return (
    <div className={cn("relative w-full flex overflow-hidden border-y border-black/5 bg-[#FACC15] py-3 shadow-inner", className)}>
      <div className={cn("flex whitespace-nowrap will-change-transform", speedClass)}>
        {[...Array(4)].map((_, arrayIndex) => (
          <div key={arrayIndex} className="flex items-center space-x-12 px-6">
            {items.map((item, index) => (
              <React.Fragment key={`${arrayIndex}-${index}`}>
                <span className="text-[13px] font-bold tracking-[0.25em] uppercase text-black">
                  {item}
                </span>
                <span className="text-black/30">✦</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee-slow {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-fast {
          animation: marquee 10s linear infinite;
        }
      `}} />
    </div>
  );
}
