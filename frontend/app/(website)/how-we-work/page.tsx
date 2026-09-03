import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import PageHeader from '@/components/layout/PageHeader';

import HowWeWorkHero from '@/components/how-we-work/HowWeWorkHero';
import MarketGap from '@/components/how-we-work/MarketGap';
import ModelBreakdown from '@/components/how-we-work/ModelBreakdown';
import AboutBanner from '@/components/about/AboutBanner';
import ServicesFAQ from '@/components/services/ServicesFAQ';

export const metadata: Metadata = {
  title: 'How We Work | The Digital Bees',
  description: 'Simple, Transparent, and Scalable Talent Deployment.',
  alternates: { canonical: `${siteConfig.url}/how-we-work` },
};

export default function HowWeWorkPage() {
  return (
    <>
      <PageHeader title="How We Work" breadcrumb="How We Work" />
      <HowWeWorkHero />
      <MarketGap />
      <ModelBreakdown />
      <AboutBanner />
      <ServicesFAQ />
    </>
  );
}
