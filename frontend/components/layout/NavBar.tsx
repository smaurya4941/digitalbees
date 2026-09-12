'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { routes } from '@/config/routes';

// Temporary Bee Icon Placeholder
const BeeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 8H9L12 2Z" fill="#FACC15" stroke="#1A202C" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 22C16 22 19 18 19 13C19 8 16 5 12 5C8 5 5 8 5 13C5 18 8 22 12 22Z" fill="#FACC15" stroke="#1A202C" strokeWidth="1.5" />
    <path d="M5 13H19" stroke="#1A202C" strokeWidth="1.5" />
    <path d="M8 9H16" stroke="#1A202C" strokeWidth="1.5" />
    <path d="M8 17H16" stroke="#1A202C" strokeWidth="1.5" />
  </svg>
);

import { motion } from 'framer-motion';

export type NavLink = {
  label: string;
  href: string;
  children?: NavLink[];
};

interface NavBarProps {
  navItems?: NavLink[];
  contactPhone?: string;
}

export default function NavBar({ navItems = [], contactPhone = '+91 836 879 0581' }: NavBarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const isHome = pathname === '/';

  return (
    <div className={cn(
      "fixed left-0 right-0 z-[200] transition-all duration-300",
      isHome ? "top-0" : "top-2 md:top-4 px-2 md:px-4"
    )}>
      <motion.header 
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "transition-all duration-300 border",
          isHome ? "border-b border-hairline" : "rounded-[2rem]",
          scrolled 
            ? "bg-white/95 backdrop-blur-md shadow-sm border-black/5" 
            : "bg-transparent border-transparent"
        )}
      >
        <div className={cn(
          "flex h-20 items-center justify-between",
          isHome ? "max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop" : "px-6 md:px-10"
        )}>
          {/* Logo */}
          <Link href={routes.home()} className="flex items-center gap-2">
            <BeeIcon />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-widest text-ink">THE DIGITAL</span>
              <span className="text-lg font-bold tracking-widest text-ink">BEES</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <div key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-1 font-semibold text-[15px] transition-colors hover:text-[#FACC15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring py-2',
                        isActive(item.href) ? 'text-[#FACC15]' : 'text-ink-muted'
                      )}
                    >
                      {item.label}
                      <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                    
                    {/* Dropdown menu */}
                    <div className="absolute top-full left-0 w-64 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                      <div className="bg-white rounded-xl shadow-lg border border-black/5 overflow-hidden flex flex-col py-2">
                        {item.children.map((child) => (
                          <Link 
                            key={child.href} 
                            href={child.href}
                            className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-[#FACC15] hover:bg-neutral-50 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'font-semibold text-[15px] transition-colors hover:text-[#FACC15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                    isActive(item.href) ? 'text-[#FACC15]' : 'text-ink-muted'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="hidden items-center gap-6 lg:flex">
            {/* Call Us */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FACC15]">
                <Phone size={18} className="text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-ink-muted">Call Us:</span>
                <span className="text-sm font-bold text-[#FACC15]">{contactPhone}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <Link
                href={routes.contact()}
                className="flex h-10 items-center justify-center rounded-full bg-[#FACC15] px-6 text-[15px] font-semibold text-ink transition-transform hover:scale-105 active:scale-95"
              >
                Get In Touch
              </Link>
              <Link
                href={routes.contact()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FACC15] text-ink transition-transform hover:scale-105 active:scale-95"
              >
                <ArrowUpRight size={20} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md p-2 text-brand-navy lg:hidden"
          >
            {mobileOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden">
            <nav
              aria-label="Primary"
              className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-hairline bg-canvas-raised px-margin-mobile py-4"
            >
              <ul className="flex flex-col">
                {navItems.map((item) => {
                  if (item.children && item.children.length > 0) {
                    return (
                      <li key={item.href} className="border-b border-hairline last:border-0 flex flex-col">
                        <Link
                          href={item.href}
                          className={cn(
                            "block py-3 text-body-md font-semibold transition-colors",
                            isActive(item.href) ? "text-[#FACC15]" : "text-ink"
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                        <div className="flex flex-col pl-4 pb-3 gap-3">
                           {item.children.map((child) => (
                             <Link
                               key={child.href}
                               href={child.href}
                               className={cn(
                                 "text-sm font-medium transition-colors",
                                 isActive(child.href) ? "text-[#FACC15]" : "text-ink-muted"
                               )}
                               onClick={() => setMobileOpen(false)}
                             >
                               {child.label}
                             </Link>
                           ))}
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={item.href} className="border-b border-hairline last:border-0">
                      <Link
                        href={item.href}
                        className={cn(
                          "block py-3 text-body-md font-semibold transition-colors",
                          isActive(item.href) ? "text-[#FACC15]" : "text-ink"
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FACC15]">
                    <Phone size={18} className="text-white fill-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-ink-muted">Call Us:</span>
                    <span className="text-sm font-bold text-[#FACC15]">{contactPhone}</span>
                  </div>
                </div>
                <Link
                  href={routes.contact()}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-[#FACC15] font-bold text-ink"
                >
                  Get In Touch
                </Link>
              </div>
            </nav>
          </div>
        )}
      </motion.header>
    </div>
  );
}
