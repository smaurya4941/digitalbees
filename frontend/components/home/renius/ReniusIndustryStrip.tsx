'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IndustryIcon } from '@/components/ui/IndustryIcon';
import { routes } from '@/config/routes';
import type { IndustrySummary } from '@/types/industry';

/**
 * "Where We Deliver" — a lightweight horizontal scroll of every published
 * industry (Renius homepage §7, Blueprint §21.6: signals breadth without a
 * full page-length section). Sits between the practices carousel and the
 * proof/case-study sections so a visitor sees "who this is for" right after
 * "what we do."
 */
export default function ReniusIndustryStrip({ industries }: { industries: IndustrySummary[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows, industries.length]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>('[data-industry-card]');
    if (!el || !card) return;
    el.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: 'smooth' });
  };

  if (industries.length === 0) return null;

  return (
    <section className="py-14 bg-white border-b border-[#CBDFF2]" aria-labelledby="industry-strip-heading">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex items-end justify-between mb-6 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FB] border border-[#CBDFF2]">
              <span className="w-2 h-2 rounded-full bg-[#E58A1F]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E6D18]">WHERE WE DELIVER</span>
            </div>
            <h2 id="industry-strip-heading" className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">
              Industries that trust the same seven practices
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous industries"
              className="w-9 h-9 rounded-xl bg-white border border-[#CBDFF2] text-[#0B1F3A] hover:bg-[#EAF2FB] hover:border-[#C6963A] flex items-center justify-center transition-all shadow-xs disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next industries"
              className="w-9 h-9 rounded-xl bg-white border border-[#CBDFF2] text-[#0B1F3A] hover:bg-[#EAF2FB] hover:border-[#C6963A] flex items-center justify-center transition-all shadow-xs disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-2 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {industries.map((industry) => (
            <Link
              key={industry.slug}
              data-industry-card
              href={industry.href || routes.industry(industry.slug)}
              className="snap-start shrink-0 basis-[62%] sm:basis-[30%] lg:basis-[19%] flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-[#FAFCFF] hover:border-[#C6963A]/70 hover:bg-white hover:shadow-[0_10px_24px_rgba(11,31,58,0.08)] transition-all duration-200 px-4 py-3.5 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E6D18]"
            >
              <span className="w-9 h-9 shrink-0 rounded-xl bg-[#EAF2FB] text-[#0B1F3A] flex items-center justify-center transition-colors group-hover:bg-[#0B1F3A] group-hover:text-white">
                <IndustryIcon name={industry.icon} className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold text-[#0B1F3A] leading-snug line-clamp-2">{industry.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
