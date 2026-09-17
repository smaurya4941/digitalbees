'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCandidateMode } from '@/lib/context/CandidateModeContext';
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

  // Hover-intent handler with 200ms delay
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

  // Whether header can be transparent at top of page (homepage & dark heroes)
  const isDarkHeroPage = pathname === '/' || pathname.startsWith('/practices');
  const isSolid = scrolled || activeMenu !== null || !isDarkHeroPage;

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[150] transition-colors duration-200 ${
          isSolid
            ? 'bg-[#0B1F3A]/96 backdrop-blur-md border-b border-[#C6963A]/40 shadow-2xl'
            : 'bg-transparent border-b border-white/10'
        }`}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link
            href="/"
            onClick={closeMegaMenu}
            className="flex items-center group shrink-0 py-1"
            aria-label="TeamBees Home"
          >
            <Image
              src="/brand/logo-teambees-white.png"
              alt="TeamBees - Building on Trust"
              width={160}
              height={55}
              priority
              className="h-10 md:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Center-Left: Desktop Primary Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden xl:flex items-center gap-1 text-[13.5px] font-medium tracking-wide h-[72px]"
          >
            {/* Practices */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('practices')}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'practices' ? null : 'practices')}
                className={`px-3.5 py-2 rounded-md transition flex items-center gap-1 group ${
                  activeMenu === 'practices' || pathname.startsWith('/practices')
                    ? 'text-[#C6963A] bg-white/5 font-semibold'
                    : 'text-white/90 hover:text-[#C6963A] hover:bg-white/5'
                }`}
                aria-expanded={activeMenu === 'practices'}
                aria-haspopup="true"
              >
                <span>Practices</span>
                <span
                  className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                    activeMenu === 'practices' ? 'rotate-180 text-[#C6963A]' : 'text-white/50 group-hover:text-[#C6963A]'
                  }`}
                >
                  expand_more
                </span>
              </button>
            </div>

            {/* Industries */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('industries')}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'industries' ? null : 'industries')}
                className={`px-3.5 py-2 rounded-md transition flex items-center gap-1 group ${
                  activeMenu === 'industries' || pathname.startsWith('/industries')
                    ? 'text-[#C6963A] bg-white/5 font-semibold'
                    : 'text-white/90 hover:text-[#C6963A] hover:bg-white/5'
                }`}
                aria-expanded={activeMenu === 'industries'}
                aria-haspopup="true"
              >
                <span>Industries</span>
                <span
                  className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                    activeMenu === 'industries' ? 'rotate-180 text-[#C6963A]' : 'text-white/50 group-hover:text-[#C6963A]'
                  }`}
                >
                  expand_more
                </span>
              </button>
            </div>

            {/* Locations */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('locations')}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'locations' ? null : 'locations')}
                className={`px-3.5 py-2 rounded-md transition flex items-center gap-1 group ${
                  activeMenu === 'locations' || pathname.startsWith('/locations')
                    ? 'text-[#C6963A] bg-white/5 font-semibold'
                    : 'text-white/90 hover:text-[#C6963A] hover:bg-white/5'
                }`}
                aria-expanded={activeMenu === 'locations'}
                aria-haspopup="true"
              >
                <span>Locations</span>
                <span
                  className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                    activeMenu === 'locations' ? 'rotate-180 text-[#C6963A]' : 'text-white/50 group-hover:text-[#C6963A]'
                  }`}
                >
                  expand_more
                </span>
              </button>
            </div>

            {/* Insights */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('insights')}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'insights' ? null : 'insights')}
                className={`px-3.5 py-2 rounded-md transition flex items-center gap-1 group ${
                  activeMenu === 'insights' || pathname.startsWith('/insights') || pathname.startsWith('/resources')
                    ? 'text-[#C6963A] bg-white/5 font-semibold'
                    : 'text-white/90 hover:text-[#C6963A] hover:bg-white/5'
                }`}
                aria-expanded={activeMenu === 'insights'}
                aria-haspopup="true"
              >
                <span>Insights</span>
                <span
                  className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                    activeMenu === 'insights' ? 'rotate-180 text-[#C6963A]' : 'text-white/50 group-hover:text-[#C6963A]'
                  }`}
                >
                  expand_more
                </span>
              </button>
            </div>

            {/* Case Studies (Direct Link per §2.5) */}
            <Link
              href="/case-studies"
              onClick={closeMegaMenu}
              className={`px-3.5 py-2 rounded-md transition ${
                pathname.startsWith('/case-studies')
                  ? 'text-[#C6963A] font-semibold'
                  : 'text-white/90 hover:text-[#C6963A] hover:bg-white/5'
              }`}
            >
              Case Studies
            </Link>

            {/* Careers */}
            <div
              className="h-full flex items-center relative"
              onMouseEnter={() => handleMouseEnter('careers')}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'careers' ? null : 'careers')}
                className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 group ${
                  activeMenu === 'careers' || pathname.startsWith('/careers')
                    ? 'text-[#C6963A] bg-white/5 font-semibold'
                    : 'text-white/90 hover:text-[#C6963A] hover:bg-white/5'
                }`}
                aria-expanded={activeMenu === 'careers'}
                aria-haspopup="true"
              >
                <span>Careers</span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  Hiring
                </span>
                <span
                  className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                    activeMenu === 'careers' ? 'rotate-180 text-[#C6963A]' : 'text-white/50 group-hover:text-[#C6963A]'
                  }`}
                >
                  expand_more
                </span>
              </button>

              {/* Careers Dropdown Popover */}
              {activeMenu === 'careers' && (
                <div
                  className="absolute top-[72px] right-0 z-50 pt-2 animate-in fade-in slide-in-from-top-2 duration-150"
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

          {/* Right: Desktop Utility Cluster */}
          <div className="hidden lg:flex items-center gap-3.5">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white/80 hover:text-[#C6963A] hover:bg-white/10 transition border border-white/10"
              title="Quick Search (Press /)"
              aria-label="Search site"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>

            {/* Region Selector */}
            <RegionSelector />

            {/* For Candidates Toggle Switch (§3.3) */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#071527]/60 border border-white/10 text-xs">
              <span
                className={`text-[11px] font-mono uppercase transition ${
                  isCandidateMode ? 'text-[#C6963A] font-bold' : 'text-white/60'
                }`}
              >
                Candidates
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={isCandidateMode}
                aria-label="Toggle Candidate Mode"
                onClick={toggleCandidateMode}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                  isCandidateMode ? 'bg-[#C6963A] justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full transition-transform shadow-sm flex items-center justify-center text-[9px] font-bold ${
                    isCandidateMode ? 'bg-[#071527] text-[#C6963A]' : 'bg-white text-slate-700'
                  }`}
                >
                  {isCandidateMode ? '✓' : ''}
                </span>
              </button>
            </div>

            {/* Primary CTA Button (§3.4) */}
            <Link
              href={isCandidateMode ? '/careers' : '/contact-us'}
              onClick={closeMegaMenu}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs tracking-wider uppercase transition shadow-md flex items-center gap-1.5 hover:-translate-y-0.5 duration-150 ${
                isCandidateMode
                  ? 'bg-[#132B4F] text-white border border-[#C6963A]/60 hover:bg-[#071527]'
                  : 'bg-[#C6963A] hover:bg-[#9C7326] text-[#071527]'
              }`}
            >
              <span>{isCandidateMode ? 'View Open Roles' : 'Book a Consultation'}</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </Link>
          </div>

          {/* Mobile Right Bar: Search + Hamburger */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/80 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="w-9 h-9 rounded-lg bg-[#C6963A] text-[#071527] font-bold flex items-center justify-center shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Full-Width Desktop Mega-Menu Panels */}
        {activeMenu === 'practices' && (
          <div
            className="w-full animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => {
              if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <PracticesMegaMenu onClose={closeMegaMenu} />
          </div>
        )}

        {activeMenu === 'industries' && (
          <div
            className="w-full animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => {
              if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <IndustriesMegaMenu onClose={closeMegaMenu} />
          </div>
        )}

        {activeMenu === 'locations' && (
          <div
            className="w-full animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => {
              if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <LocationsMegaMenu onClose={closeMegaMenu} />
          </div>
        )}

        {activeMenu === 'insights' && (
          <div
            className="w-full animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => {
              if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <InsightsMegaMenu onClose={closeMegaMenu} />
          </div>
        )}
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
            <span className="text-white/80 font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#C6963A]">badge</span>
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
                <span className="flex items-center gap-2 text-[#C6963A]">
                  <span className="material-symbols-outlined text-[18px]">category</span>
                  Practices (7 Specialist Pods)
                </span>
                <span
                  className={`material-symbols-outlined text-[18px] text-[#C6963A] transition-transform ${
                    mobileAccordion === 'practices' ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {mobileAccordion === 'practices' && (
                <div className="p-3 pt-1 space-y-1.5 border-t border-white/10 text-xs">
                  <Link
                    href="/practices/talent-bees"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded bg-white/5 flex items-center justify-between text-white/90 hover:text-[#C6963A]"
                  >
                    <span>Talent Bees (IT &amp; Staffing)</span>
                    <span className="text-[10px] font-mono text-white/40">48h SLA</span>
                  </Link>
                  <Link
                    href="/practices/digital-bees"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded bg-white/5 flex items-center justify-between text-white/90 hover:text-[#C6963A]"
                  >
                    <span>Digital Bees (Software &amp; Cloud)</span>
                    <span className="text-[10px] font-mono text-white/40">DevOps</span>
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
                    <span className="text-[10px] font-mono text-white/40">SEO/PPC</span>
                  </Link>
                  <Link
                    href="/practices/quality-bees"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded bg-white/5 flex items-center justify-between text-white/90 hover:text-[#C6963A]"
                  >
                    <span>Quality Bees (Testing &amp; QA)</span>
                    <span className="text-[10px] font-mono text-white/40">Zero Defect</span>
                  </Link>
                  <Link
                    href="/practices/servicenow-bees"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded bg-white/5 flex items-center justify-between text-white/90 hover:text-[#C6963A]"
                  >
                    <span>ServiceNow Bees</span>
                    <span className="text-[10px] font-mono text-white/40">ITSM/ITOM</span>
                  </Link>
                  <Link
                    href="/practices/energy-bees"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded bg-white/5 flex items-center justify-between text-white/90 hover:text-[#C6963A]"
                  >
                    <span>Energy Bees</span>
                    <span className="text-[10px] font-mono text-white/40">CTRM</span>
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
                <span className="flex items-center gap-2 text-[#C6963A]">
                  <span className="material-symbols-outlined text-[18px]">domain</span>
                  Industries (10 Sectors)
                </span>
                <span
                  className={`material-symbols-outlined text-[18px] text-[#C6963A] transition-transform ${
                    mobileAccordion === 'industries' ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
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
                <span className="flex items-center gap-2 text-[#C6963A]">
                  <span className="material-symbols-outlined text-[18px]">public</span>
                  Locations (6 Hubs)
                </span>
                <span
                  className={`material-symbols-outlined text-[18px] text-[#C6963A] transition-transform ${
                    mobileAccordion === 'locations' ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {mobileAccordion === 'locations' && (
                <div className="p-3 pt-1 space-y-1.5 border-t border-white/10 text-xs">
                  <Link
                    href="/locations"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>🇺🇸 United States (New York, SF)</span>
                    <span className="text-[10px] font-mono text-white/40">W2/C2C</span>
                  </Link>
                  <Link
                    href="/locations"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>🇮🇳 India (Bangalore, Noida)</span>
                    <span className="text-[10px] font-mono text-white/40">Delivery Lab</span>
                  </Link>
                  <Link
                    href="/locations"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>🇸🇬 Singapore (Marina Bay)</span>
                    <span className="text-[10px] font-mono text-white/40">APAC HQ</span>
                  </Link>
                  <Link
                    href="/locations"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>🇦🇪 UAE (Dubai DIFC)</span>
                    <span className="text-[10px] font-mono text-white/40">MENA Hub</span>
                  </Link>
                  <Link
                    href="/locations"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>🇬🇧 United Kingdom (London)</span>
                    <span className="text-[10px] font-mono text-white/40">IR35 Safe</span>
                  </Link>
                  <Link
                    href="/locations"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded hover:bg-white/5 flex items-center justify-between text-white/80"
                  >
                    <span>🇦🇺 Australia (Sydney)</span>
                    <span className="text-[10px] font-mono text-white/40">APRA CPS 234</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Direct Links */}
            <div className="space-y-1.5 pt-2">
              <Link
                href="/case-studies"
                onClick={() => setMobileOpen(false)}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-sm font-semibold text-white hover:text-[#C6963A]"
              >
                <span>Case Studies</span>
                <span className="material-symbols-outlined text-[16px] text-white/40">chevron_right</span>
              </Link>
              <Link
                href="/insights"
                onClick={() => setMobileOpen(false)}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-sm font-semibold text-white hover:text-[#C6963A]"
              >
                <span>Insights &amp; Publications</span>
                <span className="material-symbols-outlined text-[16px] text-white/40">chevron_right</span>
              </Link>
              <Link
                href="/careers"
                onClick={() => setMobileOpen(false)}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-sm font-semibold text-white hover:text-[#C6963A]"
              >
                <div className="flex items-center gap-2">
                  <span>Careers</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 rounded">
                    Hiring
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-white/40">chevron_right</span>
              </Link>
            </div>
          </div>

          {/* Persistent Bottom Sheet CTA Bar (§5) */}
          <div className="p-4 bg-[#0B1F3A] border-t border-white/10 shrink-0">
            <Link
              href={isCandidateMode ? '/careers' : '/contact-us'}
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 rounded-xl bg-[#C6963A] text-[#071527] font-bold text-xs tracking-wider uppercase shadow-lg flex items-center justify-center gap-2"
            >
              <span>{isCandidateMode ? 'View Open Roles' : 'Book a Consultation'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
