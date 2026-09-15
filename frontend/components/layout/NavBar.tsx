'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ArrowUpRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { SearchOverlay } from '@/components/search/SearchOverlay';
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

export default function NavBar({
  navItems = [],
  contactPhone = siteConfig.contact.phone,
}: NavBarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div className="fixed left-0 right-0 top-0 z-[200] transition-all duration-300">
      <motion.header 
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "transition-all duration-300 border-b",
          scrolled 
            ? "bg-brand-navy/95 backdrop-blur-md shadow-sm border-brand-gold/30" 
            : "bg-brand-navy border-transparent"
        )}
      >
        <div className="flex h-[72px] items-center justify-between max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Logo — the logo's dark wordmark needs a light surface to read
              against this header's navy background, so it sits on a small
              white chip rather than being placed directly on navy. */}
          <Link href={routes.home()} className="flex items-center">
            <span className="flex items-center rounded-lg bg-white px-3 py-1.5 shadow-sm">
              <Image
                src="/brand/teambees-logo.png"
                alt={siteConfig.name}
                width={300}
                height={103}
                priority
                className="h-9 w-auto"
              />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <div key={item.href} className="relative group h-[72px] flex items-center">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-1 font-medium text-[15px] transition-colors hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold',
                        isActive(item.href) ? 'text-brand-gold' : 'text-neutral-300'
                      )}
                    >
                      {item.label}
                      <svg className="w-4 h-4 transition-transform group-hover:rotate-180 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                    
                    {/* Dropdown menu */}
                    <div className="absolute top-full left-0 w-64 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                      <div className="bg-canvas rounded-xl shadow-lg border border-hairline overflow-hidden flex flex-col py-2">
                        {item.children.map((child) => (
                          <Link 
                            key={child.href} 
                            href={child.href}
                            className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-brand-navy hover:bg-neutral-50 transition-colors"
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
                    'font-medium text-[15px] transition-colors hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold',
                    isActive(item.href) ? 'text-brand-gold' : 'text-neutral-300'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="hidden items-center gap-6 lg:flex">
            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              <Search size={20} aria-hidden />
            </button>

            {/* Call Us */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/10">
                <Phone size={18} className="text-brand-gold fill-brand-gold" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-neutral-400">Call Us:</span>
                <span className="text-sm font-bold text-brand-gold">{contactPhone}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <Link
                href={routes.contact()}
                className="flex h-10 items-center justify-center rounded-full bg-brand-gold px-6 text-[15px] font-semibold text-brand-navy transition-transform hover:scale-105 active:scale-95"
              >
                Book a Consultation
              </Link>
            </div>
          </div>

          {/* Mobile: search + toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="rounded-full p-2 text-neutral-300 hover:bg-white/10 hover:text-white"
            >
              <Search size={20} aria-hidden />
            </button>
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-full p-2 text-neutral-300 hover:bg-white/10 hover:text-white"
            >
              {mobileOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-[72px] left-0 right-0 h-[calc(100dvh-72px)] bg-brand-navy border-t border-white/10">
            <nav
              aria-label="Primary"
              className="h-full overflow-y-auto px-margin-mobile py-6 flex flex-col"
            >
              <ul className="flex flex-col flex-1">
                {navItems.map((item) => {
                  if (item.children && item.children.length > 0) {
                    return (
                      <li key={item.href} className="border-b border-white/10 flex flex-col">
                        <Link
                          href={item.href}
                          className={cn(
                            "block py-4 text-lg font-medium transition-colors",
                            isActive(item.href) ? "text-brand-gold" : "text-white"
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                        <div className="flex flex-col pl-4 pb-4 gap-4">
                           {item.children.map((child) => (
                             <Link
                               key={child.href}
                               href={child.href}
                               className={cn(
                                 "text-base transition-colors",
                                 isActive(child.href) ? "text-brand-gold" : "text-neutral-400"
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
                    <li key={item.href} className="border-b border-white/10">
                      <Link
                        href={item.href}
                        className={cn(
                          "block py-4 text-lg font-medium transition-colors",
                          isActive(item.href) ? "text-brand-gold" : "text-white"
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              
              <div className="mt-8 flex flex-col gap-6 pb-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10">
                    <Phone size={20} className="text-brand-gold fill-brand-gold" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-neutral-400">Call Us:</span>
                    <span className="text-base font-bold text-brand-gold">{contactPhone}</span>
                  </div>
                </div>
                <Link
                  href={routes.contact()}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-brand-gold font-bold text-brand-navy"
                  onClick={() => setMobileOpen(false)}
                >
                  Book a Consultation
                </Link>
              </div>
            </nav>
          </div>
        )}
      </motion.header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
