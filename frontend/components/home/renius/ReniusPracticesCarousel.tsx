'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { practiceColor, tint } from '@/lib/practices/visuals';
import { PracticeIcon } from '@/components/ui/PracticeIcon';
import type { PracticeSummary } from '@/types/practice';

const REPEAT_TICKER = [
  'CERTIFIED SERVICENOW RESOURCES',
  'OOTB-FIRST DELIVERY APPROACH',
  'VALIDATED SPECIALISTS ONLY',
  '48-HOUR TALENT SHORTLIST',
  'ENTERPRISE GOVERNED AI AGENTS',
  'GLOBAL DELIVERY HUBS',
];

/**
 * "What We Offer" — every published practice, straight from the admin.
 * A native scroll-snap track (swipeable on touch, arrow-driven on desktop)
 * so every practice is reachable at every breakpoint.
 */
export default function ReniusPracticesCarousel({ practices }: { practices: PracticeSummary[] }) {
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
  }, [updateArrows, practices.length]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>('[data-card]');
    if (!el || !card) return;
    el.scrollBy({ left: direction * (card.offsetWidth + 24), behavior: 'smooth' });
  };

  if (practices.length === 0) return null;

  return (
    <section className="py-16 bg-[#FAFCFF] relative border-b border-[#CBDFF2]" aria-labelledby="practices-carousel-heading">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FB] border border-[#CBDFF2]">
              <span className="w-2 h-2 rounded-full bg-[#E58A1F]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E6D18]">WHAT WE OFFER</span>
            </div>
            <h2 id="practices-carousel-heading" className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F3A] tracking-tight">
              Specialized Delivery Practices
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous practices"
              className="w-10 h-10 rounded-xl bg-white border border-[#CBDFF2] text-[#0B1F3A] hover:bg-[#EAF2FB] hover:border-[#C6963A] flex items-center justify-center transition-all shadow-xs disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next practices"
              className="w-10 h-10 rounded-xl bg-white border border-[#CBDFF2] text-[#0B1F3A] hover:bg-[#EAF2FB] hover:border-[#C6963A] flex items-center justify-center transition-all shadow-xs disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="-mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-2 pt-2 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {practices.map((p) => {
            const color = practiceColor(p.color_token);
            const services = p.sub_services_count ?? 0;
            return (
              <Link
                key={p.slug}
                data-card
                href={p.href}
                className="snap-start shrink-0 basis-[85%] sm:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)] rounded-3xl bg-white border border-slate-200/90 hover:border-[#C6963A]/70 shadow-[0_10px_30px_rgba(11,31,58,0.07)] hover:shadow-[0_20px_45px_rgba(11,31,58,0.13)] hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E6D18]"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: tint(color), color }}
                    >
                      <PracticeIcon name={p.icon} className="h-5 w-5" />
                    </div>
                    {services > 0 && (
                      <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200 group-hover:border-[#C6963A]/50 transition-colors">
                        {services} {services === 1 ? 'service' : 'services'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-[#0B1F3A] mb-2 group-hover:text-[#9E6D18] transition-colors">{p.name}</h3>
                  {p.tagline && <p className="text-sm font-semibold text-[#0B1F3A]/90 leading-snug mb-2">{p.tagline}</p>}
                  {p.summary && <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{p.summary}</p>}
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#9E6D18] group-hover:text-[#0B1F3A] transition-colors">
                    Explore practice
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full transition-colors" style={{ backgroundColor: color }} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="w-full bg-[#0B1F3A] text-white py-3 overflow-hidden border-t border-b border-[#0B1F3A]/20 mt-10">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex items-center shrink-0" aria-hidden={groupIndex > 0}>
              {REPEAT_TICKER.map((text, idx) => (
                <div key={idx} className="flex items-center mx-6">
                  <span className="font-mono text-xs font-bold tracking-widest uppercase text-white/90">{text}</span>
                  <span className="ml-6 text-[#E58A1F] text-xs font-bold">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
