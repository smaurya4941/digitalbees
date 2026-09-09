import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { routes } from '@/config/routes';
import { Container } from '@/components/ui/Container';
import { getSettings } from '@/lib/api/settings';
import { getPublicNavigation, PublicNavItem } from '@/lib/api/navigation';

export default async function Footer() {
  const year = new Date().getFullYear();
  const [settings, menus] = await Promise.all([
    getSettings().catch(() => ({} as import('@/lib/api/settings').SiteSettings)),
    getPublicNavigation().catch(() => ({} as Record<string, PublicNavItem[]>))
  ]);
  const footerGroups = menus.footer || [];

  return (
    <footer className="bg-brand-navy-deep text-ink-inverse">
      <Container>
        <div className="grid gap-12 py-section-md md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <span className="text-title-md font-bold tracking-tight text-brand-gold-muted">
              {settings['site.name'] || 'The Digital Bees'}
            </span>
            <p className="mt-3 max-w-xs text-body-sm text-neutral-300">
              {settings['site.tagline'] || 'Talent + Technology from the same partner.'}
            </p>
          </div>

          {footerGroups.map((group: PublicNavItem) => (
            <nav key={group.label} aria-label={group.label}>
              <h2 className="text-eyebrow uppercase text-brand-gold-muted">{group.label}</h2>
              <ul className="mt-4 space-y-3">
                {group.children?.map((link: PublicNavItem) => (
                  <li key={link.url}>
                    <Link
                      href={link.url || '#'}
                      className="text-body-sm text-neutral-300 transition-colors hover:text-ink-inverse"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-8 text-body-sm text-neutral-300 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <li className="flex items-center gap-2">
              <MapPin size={16} strokeWidth={1.5} className="text-brand-gold-muted" aria-hidden />
              Global delivery · offices across 6 regions
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} strokeWidth={1.5} className="text-brand-gold-muted" aria-hidden />
              <a href={`mailto:${settings['contact.email'] || 'contact@digitalbees.in'}`} className="hover:text-ink-inverse">
                {settings['contact.email'] || 'contact@digitalbees.in'}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} strokeWidth={1.5} className="text-brand-gold-muted" aria-hidden />
              <a
                href={`tel:${(settings['contact.phone'] || '+91 836 879 0581').replace(/[^+\d]/g, '')}`}
                className="hover:text-ink-inverse"
              >
                {settings['contact.phone'] || '+91 836 879 0581'}
              </a>
            </li>
          </ul>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              &copy; {year} {settings['site.legal_name'] || 'The Digital Bees Corp'}. All rights reserved.
            </span>
            <Link href={routes.privacy()} className="hover:text-ink-inverse">
              Privacy
            </Link>
            <Link href={routes.terms()} className="hover:text-ink-inverse">
              Terms
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
