import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import PageHeader from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

import ServicesGrid from '@/components/services/ServicesGrid';
import AboutBanner from '@/components/about/AboutBanner';
import ServicesDeployment from '@/components/services/ServicesDeployment';
import ServicesFAQ from '@/components/services/ServicesFAQ';

export const metadata: Metadata = {
  title: 'Services | The Digital Bees',
  description: `Integrated digital workforce solutions and performance marketing services.`,
  alternates: { canonical: `${siteConfig.url}/practices` },
};

export default function PracticesHubPage() {
  return (
    <>
      <PageHeader title="Services" breadcrumb="Services" />

      <ServicesGrid />
      <AboutBanner />
      <ServicesDeployment />
      <ServicesFAQ />
    </>
  );
}
