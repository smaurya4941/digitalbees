import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { footerNav } from '@/config/navigation';
import { Container } from '@/components/ui/Container';
import { NewsletterSignup } from '@/components/layout/NewsletterSignup';
import { getSettings } from '@/lib/api/settings';
import { getPublicNavigation, PublicNavItem } from '@/lib/api/navigation';
import { getPractices } from '@/lib/api/practices';

export default async function Footer() {
  const year = new Date().getFullYear();
  const [settings, menus, practices] = await Promise.all([
    getSettings().catch(() => ({} as import('@/lib/api/settings').SiteSettings)),
    getPublicNavigation().catch(() => ({} as Record<string, PublicNavItem[]>)),
    getPractices().catch(() => [] as Awaited<ReturnType<typeof getPractices>>),
  ]);
  // CMS menu is authoritative; fall back to the static tree so the footer
  // never renders bare when the backend is unreachable or unseeded.
  const cmsFooter = menus.footer || [];
  // Copied (not aliased) so the live-practices patch below never mutates a
  // cached API response shared across requests.
  const footerGroups: PublicNavItem[] = [
    ...(cmsFooter.length > 0
      ? cmsFooter
      : footerNav.map((group, groupIndex) => ({
          id: -(groupIndex + 1),
          label: group.label,
          url: null,
          icon: null,
          children: group.links.map((link, linkIndex) => ({
            id: -((groupIndex + 1) * 100 + linkIndex),
            label: link.label,
            url: link.href,
            icon: null,
            children: [],
          })),
        }))),
  ];

  // The "Practices" (services) group is wired to live, published practices
  // rather than the CMS menu's or static fallback's fixed list, so a
  // new/archived practice is reflected without a menu edit — same reasoning
  // as the header's Services dropdown.
  if (practices.length > 0) {
    const practicesGroup: PublicNavItem = {
      id: -999,
      label: 'Practices',
      url: null,
      icon: null,
      children: practices.map((p) => ({ id: p.id, label: p.name, url: p.href, icon: null, children: [] })),
    };
    const existingIndex = footerGroups.findIndex((g) => g.label === 'Practices');
    if (existingIndex >= 0) {
      footerGroups[existingIndex] = practicesGroup;
    } else {
      footerGroups.push(practicesGroup);
    }
  }

  // Ensure Company section displays only 5 core items (Our Story, Leadership, Partnerships, Newsroom, ESG & Community)
  const companyGroupIndex = footerGroups.findIndex((g) => g.label === 'Company');
  if (companyGroupIndex >= 0 && footerGroups[companyGroupIndex].children) {
    const preferredOrder = ['Our Story', 'Leadership', 'Partnerships', 'Newsroom', 'ESG & Community', 'Careers'];
    const currentChildren = footerGroups[companyGroupIndex].children || [];
    const curated = currentChildren
      .filter((c) => preferredOrder.includes(c.label))
      .sort((a, b) => preferredOrder.indexOf(a.label) - preferredOrder.indexOf(b.label));

    footerGroups[companyGroupIndex] = {
      ...footerGroups[companyGroupIndex],
      children: curated.length >= 4 ? curated.slice(0, 5) : currentChildren.slice(0, 5),
    };
  }

  // CMS settings are authoritative; `siteConfig` is the build-time fallback.
  const siteName = settings['site.name'] || siteConfig.name;
  const legalName = settings['site.legal_name'] || siteConfig.legalName;
  const tagline = settings['site.tagline'] || siteConfig.tagline;
  const email = settings['contact.email'] || siteConfig.contact.email;
  const phone = settings['contact.phone'] || siteConfig.contact.phone;

  return (
    <footer className="bg-brand-navy-deep text-ink-inverse">
      <Container>
        <div className="grid gap-12 py-section-md md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block group" aria-label={`${siteName} Home`}>
              <Image
                src="/brand/logo-teambees-white.png"
                alt={`${siteName} - Building on Trust`}
                width={160}
                height={55}
                className="h-10 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
              />
            </Link>
            <p className="mt-3 max-w-xs text-body-sm text-neutral-300">
              {tagline}
            </p>
            <NewsletterSignup />
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
              {siteConfig.contact.presence}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} strokeWidth={1.5} className="text-brand-gold-muted" aria-hidden />
              <a href={`mailto:${email}`} className="hover:text-ink-inverse">
                {email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} strokeWidth={1.5} className="text-brand-gold-muted" aria-hidden />
              <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="hover:text-ink-inverse">
                {phone}
              </a>
            </li>
          </ul>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              &copy; {year} {legalName}. All rights reserved.
            </span>
            <Link href={routes.privacy()} className="hover:text-ink-inverse">
              Privacy
            </Link>
            <Link href={routes.terms()} className="hover:text-ink-inverse">
              Terms
            </Link>
            <Link href={routes.cookies()} className="hover:text-ink-inverse">
              Cookies
            </Link>
            <Link href={routes.sitemap()} className="hover:text-ink-inverse">
              Sitemap
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
