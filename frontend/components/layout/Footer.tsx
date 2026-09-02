import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { footerNav } from '@/config/navigation';
import { Container } from '@/components/ui/Container';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy-deep text-ink-inverse">
      <Container>
        <div className="grid gap-12 py-section-md md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <span className="text-title-md font-bold tracking-tight text-brand-gold-muted">
              {siteConfig.name}
            </span>
            <p className="mt-3 max-w-xs text-body-sm text-neutral-300">{siteConfig.tagline}</p>
          </div>

          {footerNav.map((group) => (
            <nav key={group.label} aria-label={group.label}>
              <h2 className="text-eyebrow uppercase text-brand-gold-muted">{group.label}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      {...(link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
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
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-ink-inverse">
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} strokeWidth={1.5} className="text-brand-gold-muted" aria-hidden />
              <a
                href={`tel:${siteConfig.contact.phone.replace(/[^+\d]/g, '')}`}
                className="hover:text-ink-inverse"
              >
                {siteConfig.contact.phone}
              </a>
            </li>
          </ul>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              &copy; {year} {siteConfig.legalName}. All rights reserved.
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
