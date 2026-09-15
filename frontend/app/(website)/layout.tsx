import NavBar, { NavLink } from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { getPublicNavigation, PublicNavItem } from '@/lib/api/navigation';
import { getSettings } from '@/lib/api/settings';
import { siteConfig } from '@/config/site';
import { headerNav } from '@/config/navigation';

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
  const [menus, settings] = await Promise.all([
    getPublicNavigation().catch(() => ({} as Record<string, PublicNavItem[]>)),
    getSettings().catch(() => ({} as import('@/lib/api/settings').SiteSettings)),
  ]);

  // The CMS menu is authoritative. If it is empty (backend unreachable, or the
  // menu has not been seeded) fall back to the static tree so the site never
  // renders a header with no navigation at all.
  // As requested, we override the CMS menu to only show the critical 4 items
  const navItems = headerNav;
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
