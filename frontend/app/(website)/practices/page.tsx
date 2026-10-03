import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import { siteConfig } from '@/config/site';
import { getGeneralFaqs } from '@/lib/api/faqs';
import { getCompanyFacts } from '@/lib/api/settings';

import ServicesGrid from '@/components/services/ServicesGrid';
import AboutBanner from '@/components/about/AboutBanner';
import ServicesDeployment from '@/components/services/ServicesDeployment';
import ServicesFAQ from '@/components/services/ServicesFAQ';

// Backstop revalidation; admin edits invalidate via /api/revalidate tags.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { marketsLabel } = await getCompanyFacts();

  return {
    title: `Practices | ${siteConfig.name}`,
    description: `Specialist TeamBees practices spanning talent, digital engineering, and AI — delivered from ${marketsLabel}.`,
    alternates: { canonical: `${siteConfig.url}/practices` },
  };
}

export default async function PracticesHubPage() {
  const faqs = await getGeneralFaqs();

  return (
    <>
      <PageHeader title="Services" breadcrumb="Services" />

      <ServicesGrid />
      <AboutBanner />
      <ServicesDeployment />
      <ServicesFAQ faqs={faqs} />
    </>
  );
}
