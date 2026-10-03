import type { Metadata } from 'next';
import NotFoundContent from '@/components/layout/NotFoundContent';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

/**
 * Handles notFound() thrown by any (website) page. It renders inside the
 * (website) layout, which already supplies the NavBar and Footer — so no
 * chrome here, unlike the root not-found used for unmatched URLs.
 */
export default function WebsiteNotFound() {
  return <NotFoundContent />;
}
