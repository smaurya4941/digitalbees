import NavBar, { NavLink } from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { getPublicNavigation, PublicNavItem } from '@/lib/api/navigation';
import { getSettings } from '@/lib/api/settings';

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

  const navItems = mapToNavLinks(menus.header || []);
  const contactPhone = settings['contact.phone'] || '+91 836 879 0581';

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
