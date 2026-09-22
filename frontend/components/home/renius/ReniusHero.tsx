'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Check,
  Play,
  X,
  ArrowRight,
  ArrowUp,
  Sparkles,
  Hexagon,
} from 'lucide-react';
import { LinkedinIcon, TwitterIcon, InstagramIcon } from '@/components/ui/SocialIcons';

const BANNER_SLIDES = [
  {
    id: 1,
    image: '/images/hero/hero-slide-1.jpg',
    alt: 'TeamBees Enterprise Architecture — Golden Skyscrapers',
    tagline: 'High-Consequence Enterprise Pods',
  },
  {
    id: 2,
    image: '/images/hero/hero-slide-2.jpg',
    alt: 'TeamBees Modern Engineering — Cantilevered Facade',
    tagline: 'Zero-Defect Software & Cloud Delivery',
  },
  {
    id: 3,
    image: '/images/hero/hero-slide-3.jpg',
    alt: 'TeamBees AI Swarms — Illuminated Tech Tower',
    tagline: 'Autonomous AI Swarm Infrastructure',
  },
];

const HERO_CARDS = [
  {
    id: 1,
    title: 'Autonomous AI & Swarm Pods',
    desc: 'Governed agents, production integration, and evals — not just prototypes.',
    href: '/practices/ai-bees',
    linkText: 'Explore AI Bees',
  },
  {
    id: 2,
    title: 'Talent, Validated First',
    desc: 'Five gates before a specialist reaches you. 2-business-day typical shortlist.',
    href: '/practices/talent-bees',
    linkText: 'Explore Talent Bees',
  },
  {
    id: 3,
    title: 'Certified ServiceNow & Cloud',
    desc: 'OOTB-first, CSDM at the core, 5–7 day resource turnaround across 6 global hubs.',
    href: '/practices/servicenow-bees',
    linkText: 'Explore Enterprise SaaS',
  },
];

const TICKER_ITEMS = [
  'AI-ENABLED, HUMAN-VERIFIED',
  '5–7 DAY RESOURCE TURNAROUND',
  '24/7 GLOBAL DELIVERY COVERAGE',
  'ZERO-DEFECT ARCHITECTURE',
  'SOC2 TYPE II & ISO 27001 COMPLIANT',
  '6 REGIONAL DELIVERY HUBS',
];

export default function ReniusHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Auto-scrolling logic (5 seconds per slide)
  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  // Scroll to top button
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 md:pt-36 pb-0 bg-white overflow-hidden border-b border-[#CBDFF2]">
      {/* Subtle Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none grid grid-cols-4 md:grid-cols-6 max-w-[1320px] mx-auto opacity-30">
        <div className="border-r border-slate-100 h-full" />
        <div className="border-r border-slate-100 h-full hidden md:block" />
        <div className="border-r border-slate-100 h-full" />
        <div className="border-r border-slate-100 h-full hidden md:block" />
        <div className="border-r border-slate-100 h-full" />
        <div className="border-r border-slate-100 h-full hidden md:block" />
      </div>

      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 md:px-12 lg:px-14 relative z-10">
        {/* Main Grid: Left Vertical Social Strip + Main Hero Column */}
        <div className="flex gap-6 lg:gap-10">
          {/* Left Vertical Social Links (Watermark removed, only clean social icons) */}
          <div className="hidden xl:flex flex-col items-center pt-8 w-10 shrink-0 select-none">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest -rotate-90 origin-center mb-10 whitespace-nowrap">
              Follow Us:
            </span>
            <div className="flex flex-col items-center gap-3.5">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0B1F3A] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0B1F3A] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
                aria-label="Twitter / X"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0B1F3A] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Main Hero Column */}
          <div className="flex-1 min-w-0 pb-12">
            {/* Top Row: Eyebrow + Headline on Left, Rotating Video Badge on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8">
              {/* Left Headline Area (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {/* Eyebrow */}
                <div className="flex items-center gap-2 text-[#E58A1F] font-mono text-xs font-bold uppercase tracking-[0.2em]">
                  <Hexagon className="w-3.5 h-3.5 fill-[#E58A1F] text-[#E58A1F]" />
                  <span>SEVEN SPECIALIST PRACTICES · SIX GLOBAL REGIONS</span>
                </div>

                {/* Display H1 with Inline Accent Button */}
                <h1 className="text-3xl sm:text-5xl lg:text-[62px] font-black text-[#0B1F3A] tracking-tight leading-[1.08]">
                  Expert <span className="text-[#0B1F3A]">Technology Services</span> For Enterprise &amp; <br />
                  <span className="font-normal text-slate-800">Mission-Critical AI Workflows</span>
                  <button
                    type="button"
                    onClick={() => setVideoModalOpen(true)}
                    aria-label="View architecture blueprint"
                    className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 ml-3 rounded-full border-2 border-[#E58A1F] text-[#E58A1F] align-middle hover:bg-[#E58A1F] hover:text-white transition cursor-pointer text-xs sm:text-sm font-bold shadow-xs hover:scale-105 transform"
                    title="Explore Architecture"
                  >
                    +
                  </button>
                </h1>
              </div>

              {/* Right Top Area: Rotating Video Design (matching user screenshot) */}
              <div className="lg:col-span-4 flex items-center justify-start lg:justify-end pb-2">
                <div
                  className="relative flex items-center justify-center group cursor-pointer"
                  onClick={() => setVideoModalOpen(true)}
                >
                  {/* Rotating Circular Text Ring */}
                  <svg
                    className="w-32 h-32 sm:w-36 sm:h-36 animate-[spin_20s_linear_infinite] pointer-events-none select-none"
                    viewBox="0 0 140 140"
                  >
                    <defs>
                      <path
                        id="playVideoCircle"
                        d="M 70,70 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                        fill="none"
                      />
                    </defs>
                    <text className="text-[9.5px] font-sans font-medium tracking-[3.8px] fill-slate-800">
                      <textPath href="#playVideoCircle" startOffset="0%">
                        Play Video - Play Video - Play Video -
                      </textPath>
                    </text>
                  </svg>

                  {/* Center Golden/Yellow Circle Button with Black Arrow */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoModalOpen(true);
                    }}
                    aria-label="Play Video"
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#F5B838] hover:bg-[#E5A828] text-black flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Giant Banner Card with 3 Auto-Scrolling Images & Overlaid Glass Cards */}
            <div
              className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 aspect-[16/11] sm:aspect-[16/9] lg:aspect-[21/10] min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] max-h-[640px]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* 3 Auto-scrolling Images */}
              {BANNER_SLIDES.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={idx === 0}
                    className="object-cover object-center transform scale-105 transition-transform duration-[6000ms]"
                  />
                </div>
              ))}

              {/* Ambient Dark Gradient Vignette for Readability */}
              <div className="absolute inset-0 z-15 bg-gradient-to-t from-black/90 via-black/35 to-black/10 pointer-events-none" />

              {/* Vertical 01 / 02 / 03 Slide Indicator (Right Edge) */}
              <div className="absolute right-4 sm:right-6 top-8 sm:top-1/3 -translate-y-1/2 z-20 flex flex-col gap-2.5 p-2 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 text-white">
                {BANNER_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveSlide(i)}
                    aria-label={`Go to banner slide ${i + 1}`}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                      i === activeSlide
                        ? 'text-[#E58A1F] font-bold bg-white/10'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <span>0{i + 1}</span>
                    {i === activeSlide && (
                      <span className="w-3 h-[2px] bg-[#E58A1F] rounded-full inline-block" />
                    )}
                  </button>
                ))}
              </div>

              {/* 3 Glassmorphic Bottom Cards Overlaid Inside the Banner */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {HERO_CARDS.map((card) => (
                  <div
                    key={card.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#231A15]/75 hover:bg-[#231A15]/90 backdrop-blur-xl border border-white/15 hover:border-[#E58A1F]/60 transition-all duration-200 group shadow-lg"
                  >
                    {/* Header: Checkmark in Orange Circle + Title */}
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E58A1F] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-[15px] font-bold text-white group-hover:text-[#E58A1F] transition-colors truncate">
                          {card.title}
                        </h3>
                        <p className="text-xs text-white/75 leading-relaxed mt-1 line-clamp-2">
                          {card.desc}
                        </p>
                        <Link
                          href={card.href}
                          className="text-xs font-bold text-[#E58A1F] hover:text-white transition-colors mt-2.5 inline-flex items-center gap-1"
                        >
                          <span>{card.linkText}</span>
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust-Badge Ticker Strip directly beneath Hero (Renius "Move Text" rhythm) */}
      <div className="w-full bg-[#0B1F3A] text-white py-3 overflow-hidden border-t border-b border-[#0B1F3A]/20">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex items-center shrink-0">
              {TICKER_ITEMS.map((text, idx) => (
                <div key={idx} className="flex items-center mx-6">
                  <span className="font-mono text-xs font-bold tracking-widest uppercase text-white/90">
                    {text}
                  </span>
                  <span className="ml-6 text-[#E58A1F] text-xs font-bold">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Back to Top Button (from screenshot) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white/90 hover:bg-[#E58A1F] text-[#E58A1F] hover:text-white border-2 border-[#E58A1F] flex items-center justify-center shadow-lg transition-all transform hover:scale-105"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Video / Blueprint Modal */}
      {videoModalOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl bg-[#0B1F3A] text-white rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#071527]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E58A1F]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E58A1F]">
                  TeamBees Swarm Architecture Video
                </span>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Video Player Frame */}
            <div className="relative aspect-video bg-black flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#E58A1F] text-white flex items-center justify-center mb-4 shadow-xl animate-pulse">
                <Play className="w-7 h-7 fill-white ml-1" />
              </div>
              <h3 className="text-lg font-bold mb-2">TeamBees Enterprise Pod Architecture</h3>
              <p className="text-xs text-slate-300 max-w-md">
                Seven specialist practices delivering governed AI agents, high-rigor talent bench,
                and zero-defect enterprise cloud solutions across 6 global hubs.
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/contact-us"
                  onClick={() => setVideoModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#E58A1F] hover:bg-[#D47910] text-[#0B1F3A] font-extrabold text-xs uppercase tracking-wider transition"
                >
                  Schedule an Architecture Walkthrough
                </Link>
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
