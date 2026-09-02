import type { Metadata } from 'next';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <NavBar />
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
