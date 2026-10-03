import type { Metadata } from 'next';
import NavBar, { NavLink } from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import NotFoundContent from '@/components/layout/NotFoundContent';
import { siteConfig } from '@/config/site';
import { getPublicNavigation, PublicNavItem } from '@/lib/api/navigation';
import { companyFacts, contactEmail, getSettings, socialLinks } from '@/lib/api/settings';
import { getOffices } from '@/lib/api/locations';
import { getIndustries } from '@/lib/api/industries';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

function mapToNavLinks(items: PublicNavItem[]): NavLink[] {
  return items.map((item) => ({
    label: item.label,
    href: item.url || '#',
    children: item.children ? mapToNavLinks(item.children) : undefined,
  }));
}

export default async function NotFound() {
  const [menus, settings, industries, offices] = await Promise.all([
    getPublicNavigation().catch(() => ({} as Record<string, PublicNavItem[]>)),
    getSettings().catch(() => ({} as import('@/lib/api/settings').SiteSettings)),
    getIndustries().catch(() => [] as Awaited<ReturnType<typeof getIndustries>>),
    getOffices(),
  ]);

  const navItems = mapToNavLinks(menus.header || []);
  const contactPhone = settings['contact.phone'] || siteConfig.contact.phone;

  return (
    <>
      <NavBar
        navItems={navItems}
        contactPhone={contactPhone}
        industries={industries}
        social={socialLinks(settings)}
        contactEmail={contactEmail(settings)}
        markets={companyFacts(settings).markets}
        offices={offices}
      />
      <main id="main" className="flex-1">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
