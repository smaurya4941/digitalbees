'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCandidateMode } from '@/lib/context/CandidateModeContext';
import {
  ChevronDown,
  Search,
  ArrowRight,
  Menu,
  X,
  UserCheck,
  Layers,
  Building2,
  Globe,
  Briefcase,
  ChevronRight,
  Sparkles,
  Mail,
} from 'lucide-react';
import { LinkedinIcon, TwitterIcon, InstagramIcon } from '@/components/ui/SocialIcons';
import { PracticesMegaMenu } from './MegaMenu/PracticesMegaMenu';
import { IndustriesMegaMenu } from './MegaMenu/IndustriesMegaMenu';
import { LocationsMegaMenu } from './MegaMenu/LocationsMegaMenu';
import { InsightsMegaMenu } from './MegaMenu/InsightsMegaMenu';
import { CareersMegaMenu } from './MegaMenu/CareersMegaMenu';
import { RegionSelector } from './MegaMenu/RegionSelector';
import { SearchOverlay } from '@/components/search/SearchOverlay';

export type NavLink = {
  label: string;
  href: string;
  children?: NavLink[];
};

export interface NavBarProps {
  navItems?: NavLink[];
  contactPhone?: string;
}

type ActiveMenu = 'practices' | 'industries' | 'locations' | 'insights' | 'careers' | null;

export default function NavBar({ navItems, contactPhone }: NavBarProps = {}) {
  const pathname = usePathname();
  const { isCandidateMode, toggleCandidateMode } = useCandidateMode();

  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>('practices');

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus on route change
  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard escape listener to close open menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setMobileOpen(false);
      }
      if ((e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  // Click outside to close active dropdown menu
  useEffect(() => {
    if (!activeMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('header')) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  // Hover-intent handler with 180ms delay
  const handleMouseEnter = useCallback((menu: ActiveMenu) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = setTimeout(() => {
      setActiveMenu(menu);
    }, 180);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    closeTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  }, []);

  const closeMegaMenu = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveMenu(null);
  }, []);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[150] transition-all duration-200 bg-[#EAF2FB]/95 backdrop-blur-xl border-b border-[#CBDFF2] ${
          scrolled ? 'shadow-md shadow-[#0B1F3A]/5' : 'shadow-xs'
        }`}
        onMouseLeave={handleMouseLeave}
      >
        {/* Subtle gold top hairline accent */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C6963A]/40 to-transparent pointer-events-none" />

        {/* Tier 1 Topbar (thin strip, Navy): info@teambeescorp.com + region indicator + social icons */}
        <div className="bg-[#0B1F3A] text-white/80 border-b border-white/10 hidden md:block">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-8 flex items-center justify-between text-[11.5px] font-medium">
            <div className="flex items-center gap-6">
              <a
                href="mailto:info@teambeescorp.com"
                className="flex items-center gap-1.5 text-white/80 hover:text-[#C6963A] transition"
              >
                <Mail className="h-3 w-3 text-[#C6963A]" />
                <span>info@teambeescorp.com</span>
              </a>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5 text-white/70">
                <Globe className="h-3 w-3 text-[#C6963A]" />
                <span>Delivering from India · USA · Singapore · UAE</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-[10px] uppercase font-mono tracking-wider">Follow Us:</span>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#C6963A] transition" aria-label="LinkedIn">
                <LinkedinIcon className="h-3 w-3" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#C6963A] transition" aria-label="Twitter">
                <TwitterIcon className="h-3 w-3" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#C6963A] transition" aria-label="Instagram">
                <InstagramIcon className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between gap-4">
          {/* 1. Left: Brand Logo (Dark version for light blue background) */}
          <Link
            href="/"
            onClick={closeMegaMenu}
            className="flex items-center group shrink-0 py-1"
            aria-label="TeamBees Home"
          >
            <Image
              src="/brand/logo-teambees.png"
              alt="TeamBees - Building on Trust"
              width={160}
              height={55}
              priority
              className="h-10 md:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* 2. Center: Desktop Primary Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-[13.5px] font-semibold h-[72px]"
          >
            {/* Practices (Services) */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('practices')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'practices' ? null : 'practices')}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 group ${
                  activeMenu === 'practices' || pathname.startsWith('/practices')
                    ? 'text-[#C6963A] bg-white/90 shadow-xs'
                    : 'text-[#0B1F3A] hover:text-[#C6963A] hover:bg-white/70'
                }`}
                aria-expanded={activeMenu === 'practices'}
                aria-haspopup="true"
              >
                <span>Practices (Services)</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeMenu === 'practices' ? 'rotate-180 text-[#C6963A]' : 'text-[#0B1F3A]/60 group-hover:text-[#C6963A]'
                  }`}
                />
              </button>

              {activeMenu === 'practices' && (
                <div
                  className="absolute top-[60px] left-0 pt-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150"
                  onMouseEnter={() => {
                    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                  }}
                  onMouseLeave={handleMouseLeave}
                >
                  <PracticesMegaMenu onClose={closeMegaMenu} />
                </div>
              )}
            </div>

            {/* Industries */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('industries')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'industries' ? null : 'industries')}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 group ${
                  activeMenu === 'industries' || pathname.startsWith('/industries')
                    ? 'text-[#C6963A] bg-white/90 shadow-xs'
                    : 'text-[#0B1F3A] hover:text-[#C6963A] hover:bg-white/70'
                }`}
                aria-expanded={activeMenu === 'industries'}
                aria-haspopup="true"
              >
                <span>Industries</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeMenu === 'industries' ? 'rotate-180 text-[#C6963A]' : 'text-[#0B1F3A]/60 group-hover:text-[#C6963A]'
                  }`}
                />
              </button>

              {activeMenu === 'industries' && (
                <div
                  className="absolute top-[60px] left-0 pt-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150"
                  onMouseEnter={() => {
                    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                  }}
                  onMouseLeave={handleMouseLeave}
                >
                  <IndustriesMegaMenu onClose={closeMegaMenu} />
                </div>
              )}
            </div>

            {/* Locations */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('locations')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'locations' ? null : 'locations')}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 group ${
                  activeMenu === 'locations' || pathname.startsWith('/locations')
                    ? 'text-[#C6963A] bg-white/90 shadow-xs'
                    : 'text-[#0B1F3A] hover:text-[#C6963A] hover:bg-white/70'
                }`}
                aria-expanded={activeMenu === 'locations'}
                aria-haspopup="true"
              >
                <span>Locations</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeMenu === 'locations' ? 'rotate-180 text-[#C6963A]' : 'text-[#0B1F3A]/60 group-hover:text-[#C6963A]'
                  }`}
                />
              </button>

              {activeMenu === 'locations' && (
                <div
                  className="absolute top-[60px] left-0 pt-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150"
                  onMouseEnter={() => {
                    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                  }}
                  onMouseLeave={handleMouseLeave}
                >
                  <LocationsMegaMenu onClose={closeMegaMenu} />
                </div>
              )}
            </div>

            {/* Careers */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('careers')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'careers' ? null : 'careers')}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 group ${
                  activeMenu === 'careers' || pathname.startsWith('/careers')
                    ? 'text-[#C6963A] bg-white/90 shadow-xs'
                    : 'text-[#0B1F3A] hover:text-[#C6963A] hover:bg-white/70'
                }`}
                aria-expanded={activeMenu === 'careers'}
                aria-haspopup="true"
              >
                <span>Careers</span>
                <span className="px-1.5 py-0.5 text-[9.5px] font-semibold bg-[#C6963A]/15 text-[#7A5606] rounded-full border border-[#C6963A]/30 tracking-tight">
                  Hiring
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    activeMenu === 'careers' ? 'rotate-180 text-[#C6963A]' : 'text-[#0B1F3A]/60 group-hover:text-[#C6963A]'
                  }`}
                />
              </button>

              {activeMenu === 'careers' && (
                <div
                  className="absolute top-[60px] left-0 pt-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150"
                  onMouseEnter={() => {
                    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                  }}
                  onMouseLeave={handleMouseLeave}
                >
                  <CareersMegaMenu onClose={closeMegaMenu} />
                </div>
              )}
            </div>
          </nav>

          {/* 3 & 4. Right: Search Box & Book Consultation Button */}
          <div className="hidden sm:flex items-center gap-3.5">
            {/* Search Box */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white border border-[#CBDFF2] hover:border-[#0B1F3A]/30 text-xs text-[#0B1F3A] shadow-xs hover:shadow transition-all w-44 md:w-52 lg:w-60 xl:w-64 group"
              title="Search site (Press / or ⌘K)"
              aria-label="Search site"
            >
              <div className="flex items-center gap-2 text-neutral-500 group-hover:text-[#0B1F3A]">
                <Search className="h-3.5 w-3.5 text-[#C6963A]" />
                <span className="text-xs font-normal truncate">Search practices, skills...</span>
              </div>
              <kbd className="hidden sm:inline-block text-[10px] font-mono text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                ⌘K
              </kbd>
            </button>

            {/* Book Consultation Button */}
            <Link
              href="/contact-us"
              onClick={closeMegaMenu}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D8A74A] to-[#C6963A] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#0B1F3A] shadow-md shadow-[#C6963A]/25 transition-all duration-150 hover:-translate-y-0.5 hover:from-[#E5B556] hover:to-[#D5A036] hover:shadow-lg hover:shadow-[#C6963A]/35 shrink-0"
            >
              <span>Book Consultation</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Right Bar: Search + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="w-9 h-9 rounded-xl bg-white/80 border border-[#CBDFF2] text-[#0B1F3A] flex items-center justify-center hover:bg-white transition-colors"
            >
              <Search className="h-4 w-4 text-[#C6963A]" />
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#D8A74A] to-[#C6963A] text-[#0B1F3A] font-bold flex items-center justify-center shadow-sm"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Search Overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Full-Screen Navigation Overlay (<768px / xl:hidden) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[140] bg-[#071527] pt-[72px] flex flex-col xl:hidden text-white animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Candidate Mode Toggle Strip at Top */}
          <div className="px-6 py-3 bg-[#0B1F3A] border-b border-white/10 flex items-center justify-between text-xs">
            <span className="text-white/80 font-medium flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-[#C6963A]" />
              For Candidates / Job Seekers
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isCandidateMode}
              onClick={toggleCandidateMode}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${
                isCandidateMode ? 'bg-[#C6963A] justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Scrollable Accordion Tree */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {/* Practices Accordion */}
            <div className="rounded-xl border border-white/10 bg-[#0B1F3A]/70 overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setMobileAccordion(mobileAccordion === 'practices' ? null : 'practices')
                }
                className="w-full p-3.5 flex items-center justify-between text-left font-bold text-sm"
              >
                <span className="flex items-center gap-2.5 text-[#C6963A]">
                  <Layers className="h-4 w-4" />
                  Practices (7 Specialist Pods)
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-[#C6963A] transition-transform duration-200 ${
                    mobileAccordion === 'practices' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobileAccordion === 'practices' && (
                <div className="p-3 pt-1 space-y-1.5 border-t border-white/10 text-xs">
                  <Link
                    href="/practices/talent-bees"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded bg-white/5 flex items-center justify-between text-white/90 hover:text-[#C6963A]"
                  >
                    <span>Talent Bees (IT &amp; Staffing)</span>
                    <span className="text-[10px] font-mono text-white/70">48h SLA</span>
                  </Link>
                  <Link
                    href="/practices/digital-bees"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded bg-white/5 flex items-center justify-between text-white/90 hover:text-[#C6963A]"
                  >
                    <span>Digital Bees (Software &amp; Cloud)</span>
                    <span className="text-[10px] font-mono text-white/70">DevOps</span>
                  </Link>
                  <Link
                    href="/practices/ai-bees"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded bg-[#6B4FA1]/20 border border-[#6B4FA1]/40 flex items-center justify-between text-purple-200 font-semibold"
                  >
                    <span>AI Bees (Agents &amp; Swarms)</span>
                    <span className="text-[10px] font-mono text-purple-300">CORE</span>
                  </Link>
                  <Link
                    href="/practices/marketing-bees"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded bg-white/5 flex items-center justify-between text-white/90 hover:text-[#C6963A]"
                  >
                    <span>Marketing Bees (Growth)</span>
                    <span className="text-[10px] font-mono text-white/70">SEO/PPC</span>
                  </Link>
                  <Link
                    href="/practices/quality-bees"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded bg-white/5 flex items-center justify-between text-white/90 hover:text-[#C6963A]"
                  >
                    <span>Quality Bees (Testing &amp; QA)</span>
                    <span className="text-[10px] font-mono text-white/70">Zero Defect</span>
                  </Link>
                  <Link
                    href="/practices/servicenow-bees"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded bg-white/5 flex items-center justify-between text-white/90 hover:text-[#C6963A]"
                  >
                    <span>ServiceNow Bees</span>
                    <span className="text-[10px] font-mono text-white/70">ITSM/ITOM</span>
                  </Link>
                  <Link
                    href="/practices/energy-bees"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded bg-white/5 flex items-center justify-between text-white/90 hover:text-[#C6963A]"
                  >
                    <span>Energy Bees</span>
                    <span className="text-[10px] font-mono text-white/70">CTRM</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Industries Accordion */}
            <div className="rounded-xl border border-white/10 bg-[#0B1F3A]/70 overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setMobileAccordion(mobileAccordion === 'industries' ? null : 'industries')
                }
                className="w-full p-3.5 flex items-center justify-between text-left font-bold text-sm"
              >
                <span className="flex items-center gap-2.5 text-[#C6963A]">
                  <Building2 className="h-4 w-4" />
                  Industries (10 Sectors)
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-[#C6963A] transition-transform duration-200 ${
                    mobileAccordion === 'industries' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobileAccordion === 'industries' && (
                <div className="p-3 pt-1 space-y-1 border-t border-white/10 text-xs">
                  <Link
                    href="/industries/banking-financial-services"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2 rounded hover:bg-white/5 text-white/80"
                  >
                    Banking &amp; Financial Services
                  </Link>
                  <Link
                    href="/industries/healthcare-life-sciences"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2 rounded hover:bg-white/5 text-white/80"
                  >
                    Healthcare &amp; Life Sciences
                  </Link>
                  <Link
                    href="/industries/energy-utilities"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2 rounded hover:bg-white/5 text-white/80"
                  >
                    Energy &amp; Utilities
                  </Link>
                  <Link
                    href="/industries/saas-technology"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2 rounded hover:bg-white/5 text-white/80"
                  >
                    SaaS &amp; Technology
                  </Link>
                  <Link
                    href="/industries/retail-ecommerce"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2 rounded hover:bg-white/5 text-white/80"
                  >
                    Retail &amp; eCommerce
                  </Link>
                  <Link
                    href="/industries/manufacturing-industrial"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2 rounded hover:bg-white/5 text-white/80"
                  >
                    Manufacturing &amp; Industrial
                  </Link>
                  <Link
                    href="/industries/public-sector-government"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2 rounded hover:bg-white/5 text-white/80"
                  >
                    Public Sector &amp; Government
                  </Link>
                  <Link
                    href="/industries/telecom-media"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2 rounded hover:bg-white/5 text-white/80"
                  >
                    Telecom &amp; Media
                  </Link>
                  <Link
                    href="/industries/logistics-supply-chain"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2 rounded hover:bg-white/5 text-white/80"
                  >
                    Logistics &amp; Supply Chain
                  </Link>
                  <Link
                    href="/industries/global-system-integrators"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2 rounded hover:bg-white/5 text-white/80"
                  >
                    Global System Integrators (GSIs)
                  </Link>
                </div>
              )}
            </div>

            {/* Locations Accordion */}
            <div className="rounded-xl border border-white/10 bg-[#0B1F3A]/70 overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setMobileAccordion(mobileAccordion === 'locations' ? null : 'locations')
                }
                className="w-full p-3.5 flex items-center justify-between text-left font-bold text-sm"
              >
                <span className="flex items-center gap-2.5 text-[#C6963A]">
                  <Globe className="h-4 w-4" />
                  Locations (6 Global Hubs)
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-[#C6963A] transition-transform duration-200 ${
                    mobileAccordion === 'locations' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobileAccordion === 'locations' && (
                <div className="p-3 pt-1 space-y-1.5 border-t border-white/10 text-xs">
                  <Link
                    href="/locations"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>🇺🇸 United States (New York, SF)</span>
                    <span className="text-[10px] font-mono text-white/70">W2/C2C</span>
                  </Link>
                  <Link
                    href="/locations"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>🇮🇳 India (Bangalore, Noida)</span>
                    <span className="text-[10px] font-mono text-white/70">Delivery Lab</span>
                  </Link>
                  <Link
                    href="/locations"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>🇸🇬 Singapore (Marina Bay)</span>
                    <span className="text-[10px] font-mono text-white/70">APAC HQ</span>
                  </Link>
                  <Link
                    href="/locations"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>🇦🇪 UAE (Dubai DIFC)</span>
                    <span className="text-[10px] font-mono text-white/70">MENA Hub</span>
                  </Link>
                  <Link
                    href="/locations"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>🇬🇧 United Kingdom (London)</span>
                    <span className="text-[10px] font-mono text-white/70">IR35 Safe</span>
                  </Link>
                  <Link
                    href="/locations"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>🇦🇺 Australia (Sydney)</span>
                    <span className="text-[10px] font-mono text-white/70">APRA CPS 234</span>
                  </Link>
                  <Link
                    href="/locations"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 block p-2 rounded bg-[#C6963A]/10 text-center font-bold text-[#C6963A] border border-[#C6963A]/20 hover:bg-[#C6963A]/20"
                  >
                    View All Locations &amp; Compliance →
                  </Link>
                </div>
              )}
            </div>

            {/* Careers Accordion */}
            <div className="rounded-xl border border-white/10 bg-[#0B1F3A]/70 overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setMobileAccordion(mobileAccordion === 'careers' ? null : 'careers')
                }
                className="w-full p-3.5 flex items-center justify-between text-left font-bold text-sm"
              >
                <div className="flex items-center gap-2.5 text-[#C6963A]">
                  <Briefcase className="h-4 w-4" />
                  <span>Careers</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#C6963A]/20 text-[#D8A74A] rounded-full border border-[#C6963A]/30">
                    24 Roles
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-[#C6963A] transition-transform duration-200 ${
                    mobileAccordion === 'careers' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobileAccordion === 'careers' && (
                <div className="p-3 pt-1 space-y-1.5 border-t border-white/10 text-xs">
                  <Link
                    href="/careers"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded bg-white/5 flex items-center justify-between text-white/90 hover:text-[#C6963A]"
                  >
                    <span>Open Roles &amp; Opportunities</span>
                    <span className="text-[10px] font-mono text-emerald-400">Hiring</span>
                  </Link>
                  <Link
                    href="/careers"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>Life at TeamBees &amp; Culture</span>
                    <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                  </Link>
                  <Link
                    href="/careers"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>AI Upskilling &amp; Benefits</span>
                    <Sparkles className="h-3.5 w-3.5 text-[#C6963A]" />
                  </Link>
                  <Link
                    href="/contact-us"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>Join Talent Network (Fast-Track)</span>
                    <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                  </Link>
                  <Link
                    href="/careers"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 block p-2 rounded bg-[#C6963A]/10 text-center font-bold text-[#C6963A] border border-[#C6963A]/20 hover:bg-[#C6963A]/20"
                  >
                    Explore Careers Hub →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Persistent Bottom Sheet CTA Bar */}
          <div className="p-4 bg-[#0B1F3A] border-t border-white/10 shrink-0">
            <Link
              href={isCandidateMode ? '/careers' : '/contact-us'}
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D8A74A] to-[#C6963A] text-[#0B1F3A] font-extrabold text-xs tracking-wider uppercase shadow-lg flex items-center justify-center gap-2"
            >
              <span>{isCandidateMode ? 'View Open Roles' : 'Book a Consultation'}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

