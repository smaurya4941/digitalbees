'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { headerNav, practicesMegaMenu } from '@/config/navigation';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [practicesOpen, setPracticesOpen] = useState(false);

  // Collapse transient menus when the route changes (back/forward included).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting UI on navigation is the intended use
    setMobileOpen(false);
    setPracticesOpen(false);
  }, [pathname]);

  // Lock scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-[200] border-b border-hairline bg-canvas/90 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            href={routes.home()}
            className="text-title-md font-bold tracking-tight text-brand-navy"
          >
            {siteConfig.name}
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {headerNav.map((item) =>
              item.label === 'Practices' ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setPracticesOpen(true)}
                  onMouseLeave={() => setPracticesOpen(false)}
                >
                  <button
                    type="button"
                    aria-expanded={practicesOpen}
                    aria-haspopup="true"
                    onClick={() => setPracticesOpen((v) => !v)}
                    className={cn(
                      'flex items-center gap-1 rounded-md px-3 py-2 text-nav text-ink-muted transition-colors hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                      isActive(item.href) && 'text-brand-navy',
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      className={cn('transition-transform', practicesOpen && 'rotate-180')}
                      aria-hidden
                    />
                  </button>

                  {practicesOpen && (
                    <div className="absolute left-0 top-full w-[520px] pt-2">
                      <div className="grid grid-cols-2 gap-1 rounded-lg border border-hairline bg-canvas-raised p-3 shadow-lg">
                        {practicesMegaMenu.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="rounded-md px-3 py-2 text-body-sm text-ink-muted transition-colors hover:bg-canvas-sunken hover:text-brand-navy"
                          >
                            {link.label}
                          </Link>
                        ))}
                        <Link
                          href={practicesMegaMenu.viewAll.href}
                          className="col-span-2 mt-1 border-t border-hairline px-3 pt-3 text-body-sm font-semibold text-brand-navy hover:underline"
                        >
                          {practicesMegaMenu.viewAll.label} &rarr;
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-nav text-ink-muted transition-colors hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                    isActive(item.href) && 'text-brand-navy',
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Right cluster */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href={routes.search()}
              aria-label="Search"
              className="rounded-md p-2 text-ink-muted transition-colors hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <Search size={18} strokeWidth={1.5} aria-hidden />
            </Link>
            <Button href={routes.contact()} size="sm" variant="secondary">
              Get in touch
            </Button>
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
      </Container>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden">
          <nav
            aria-label="Primary"
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-hairline bg-canvas-raised px-margin-mobile py-4"
          >
            <ul className="flex flex-col">
              {headerNav.map((item) => (
                <li key={item.href} className="border-b border-hairline last:border-0">
                  <Link
                    href={item.href}
                    className="block py-3 text-body-md text-ink"
                  >
                    {item.label}
                  </Link>
                  {item.label === 'Practices' && (
                    <ul className="pb-2 pl-4">
                      {practicesMegaMenu.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="block py-2 text-body-sm text-ink-muted"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2">
              <Button href={routes.search()} variant="tertiary" block>
                Search
              </Button>
              <Button href={routes.contact()} variant="secondary" block>
                Get in touch
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
