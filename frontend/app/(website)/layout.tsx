import NavBar, { NavLink } from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import SkipLink from '@/components/ui/SkipLink';
import { CandidateModeProvider } from '@/lib/context/CandidateModeContext';
import { getPublicNavigation, PublicNavItem } from '@/lib/api/navigation';
import { companyFacts, contactEmail, getSettings, socialLinks } from '@/lib/api/settings';
import { getOffices } from '@/lib/api/locations';
import { getPractices } from '@/lib/api/practices';
import { getIndustries } from '@/lib/api/industries';
import { siteConfig } from '@/config/site';
import { headerNav } from '@/config/navigation';
import { routes } from '@/config/routes';

function mapToNavLinks(items: PublicNavItem[]): NavLink[] {
  return items.map((item) => ({
    label: item.label,
    href: item.url || '#',
    children: item.children ? mapToNavLinks(item.children) : undefined,
  }));
}

/**
 * Chrome for every public marketing page: header + footer. Route groups keep
 * this out of the URL. Legal pages use their own group.
 */
export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const [menus, settings, practices, industries, offices] = await Promise.all([
    getPublicNavigation().catch(() => ({} as Record<string, PublicNavItem[]>)),
    getSettings().catch(() => ({} as import('@/lib/api/settings').SiteSettings)),
    getPractices().catch(() => [] as Awaited<ReturnType<typeof getPractices>>),
    getIndustries().catch(() => [] as Awaited<ReturnType<typeof getIndustries>>),
    getOffices(),
  ]);

  // The CMS menu is authoritative. If it is empty (backend unreachable, or the
  // menu has not been seeded) fall back to the static tree so the site never
  // renders a header with no navigation at all.
  // As requested, we override the CMS menu to only show the critical 4 items.
  // "Services" gets a dropdown of every currently-published practice, fetched
  // live so a new/archived practice shows up without a code change.
  const practiceLinks: NavLink[] = practices.map((p) => ({ label: p.name, href: p.href }));
  const navItems: NavLink[] = headerNav.map((item) =>
    item.label === 'Services' && practiceLinks.length > 0
      ? { ...item, children: [...practiceLinks, { label: 'View all Services', href: routes.practices() }] }
      : item,
  );
  const contactPhone = settings['contact.phone'] || siteConfig.contact.phone;

  return (
    <CandidateModeProvider>
      <SkipLink />
      <NavBar
        navItems={navItems}
        contactPhone={contactPhone}
        practices={practices}
        industries={industries}
        social={socialLinks(settings)}
        contactEmail={contactEmail(settings)}
        markets={companyFacts(settings).markets}
        offices={offices}
      />
      <main id="main" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <Footer />
    </CandidateModeProvider>
  );
}
