import type { Metadata } from 'next';
import NavBar, { NavLink } from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';
import { getPublicNavigation, PublicNavItem } from '@/lib/api/navigation';
import { getSettings } from '@/lib/api/settings';

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
        <Section space="lg">
          <div className="flex max-w-xl flex-col gap-4">
            <span className="text-eyebrow uppercase text-brand-gold-muted">Error 404</span>
            <h1 className="text-display-md text-ink">This page couldn’t be found</h1>
            <p className="text-body-lg text-ink-muted">
              The page may have moved or never existed. Try one of these instead.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button href={routes.home()}>Go home</Button>
              <Button href={routes.practices()} variant="tertiary">
                Explore practices
              </Button>
              <Button href={routes.search()} variant="ghost">
                Search
              </Button>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
