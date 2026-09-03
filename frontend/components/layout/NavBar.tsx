'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { headerNav } from '@/config/navigation';
import { Container } from '@/components/ui/Container';

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

export default function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
            {headerNav.map((item) => (
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
            ))}
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
                <span className="text-sm font-bold text-[#FACC15]">{siteConfig.contact.phone}</span>
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
                {headerNav.map((item) => (
                  <li key={item.href} className="border-b border-hairline last:border-0">
                    <Link
                      href={item.href}
                      className={cn(
                        "block py-3 text-body-md font-semibold transition-colors",
                        isActive(item.href) ? "text-[#FACC15]" : "text-ink"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FACC15]">
                    <Phone size={18} className="text-white fill-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-ink-muted">Call Us:</span>
                    <span className="text-sm font-bold text-[#FACC15]">{siteConfig.contact.phone}</span>
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
