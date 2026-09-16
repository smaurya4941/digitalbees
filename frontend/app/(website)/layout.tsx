import NavBar, { NavLink } from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { getPublicNavigation, PublicNavItem } from '@/lib/api/navigation';
import { getSettings } from '@/lib/api/settings';
import { getPractices } from '@/lib/api/practices';
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
  const [menus, settings, practices] = await Promise.all([
    getPublicNavigation().catch(() => ({} as Record<string, PublicNavItem[]>)),
    getSettings().catch(() => ({} as import('@/lib/api/settings').SiteSettings)),
    getPractices().catch(() => [] as Awaited<ReturnType<typeof getPractices>>),
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
    <>
      <NavBar navItems={navItems} contactPhone={contactPhone} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
