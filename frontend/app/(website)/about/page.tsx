import type { Metadata } from 'next';
import { getCompanyMilestones } from '@/lib/api/company';
import { siteConfig } from '@/config/site';
import { routes } from '@/config/routes';

import AboutHero from '@/components/about/AboutHero';
import AboutMission from '@/components/about/AboutMission';
import AboutSevenBeesModel from '@/components/about/AboutSevenBeesModel';
import AboutTimeline from '@/components/about/AboutTimeline';
import AboutProofBar from '@/components/about/AboutProofBar';
import GlobalPresence from '@/components/home/GlobalPresence';
import AboutCtaBand from '@/components/about/AboutCtaBand';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description:
    'Seven specialist practices. Four delivery continents. One accountable team that can staff it, build it, test it, and keep it running.',
  alternates: {
    canonical: `${siteConfig.url}${routes.about()}`,
  },
  openGraph: {
    title: `About TeamBees | Talent and Technology, from the Same Partner`,
    description:
      'Seven specialist practices. Four delivery continents. One accountable team that can staff it, build it, test it, and keep it running.',
    url: `${siteConfig.url}${routes.about()}`,
    type: 'website',
  },
};

export default async function AboutPage() {
  const milestones = await getCompanyMilestones().catch(() => []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About TeamBees Corp',
    description:
      'Seven specialist practices. Four delivery continents. One accountable team that can staff it, build it, test it, and keep it running.',
    url: `${siteConfig.url}${routes.about()}`,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      foundingDate: '2021',
      numberOfEmployees: '50+',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Breadcrumb + Hero */}
      <AboutHero />

      {/* 2. Mission Statement */}
      <AboutMission />

      {/* 3. The "Seven Bees" Model Explained */}
      <AboutSevenBeesModel />

      {/* 4. Timeline / Milestones */}
      <AboutTimeline milestones={milestones} />

      {/* 5. Company Proof Bar */}
      <AboutProofBar />

      {/* 6. Global Footprint (reused component from homepage Section 9) */}
      <GlobalPresence
        eyebrow="GLOBAL FOOTPRINT · SOVEREIGN GOVERNANCE"
        title="Global Presence, Local Execution"
        subtitle="Four interconnected delivery continents operating on 24/7 follow-the-sun engineering."
        limit={4}
      />

      {/* 7. CTA Band */}
      <AboutCtaBand />
    </>
  );
}
