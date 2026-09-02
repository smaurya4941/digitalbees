import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';

/**
 * Chrome for every public marketing page: header + footer. Route groups keep
 * this out of the URL. Legal pages use their own group.
 */
export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
