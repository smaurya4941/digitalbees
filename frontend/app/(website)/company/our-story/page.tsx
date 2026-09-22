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
  title: `Our Story | ${siteConfig.name}`,
  description:
    'Seven specialist practices. Four delivery continents. One team that can staff it, build it, test it, and keep it running.',
  alternates: {
    canonical: `${siteConfig.url}${routes.companyOurStory()}`,
  },
  openGraph: {
    title: `Our Story | ${siteConfig.name}`,
    description:
      'Seven specialist practices. Four delivery continents. One team that can staff it, build it, test it, and keep it running.',
    url: `${siteConfig.url}${routes.companyOurStory()}`,
    type: 'website',
  },
};

export default async function OurStoryPage() {
  const milestones = await getCompanyMilestones().catch(() => []);

  return (
    <>
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

      {/* 6. Global Footprint (reused from homepage Section 9) */}
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
