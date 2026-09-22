import { Suspense } from 'react';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import ContactHero from '@/components/contact/ContactHero';
import ContactPageClient from '@/components/contact/ContactPageClient';
import OfficeLocations from '@/components/contact/OfficeLocations';

export const metadata: Metadata = {
  title: `Contact Us | Persona-Routed Enterprise Inquiries | ${siteConfig.name}`,
  description:
    'Persona-routed enterprise contact portal: connect directly with practice directors for talent bench requests, strategic delivery consultations, alliances, and media inquiries.',
  alternates: { canonical: `${siteConfig.url}/contact-us` },
};

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FF]">
      {/* 1. Hero & Trust Bar */}
      <ContactHero />

      {/* 2 & 3. Persona Router, Dynamic Form Panel with Practice Dispatch & Existing Client Shortcut */}
      <Suspense
        fallback={
          <div className="py-24 text-center text-sm font-medium text-ink-muted">
            Loading Enterprise Contact Portal...
          </div>
        }
      >
        <ContactPageClient />
      </Suspense>

      {/* 4. Global Delivery Hubs & Office Locations */}
      <OfficeLocations />
    </main>
  );
}
