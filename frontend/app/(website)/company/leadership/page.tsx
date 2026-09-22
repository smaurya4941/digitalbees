import type { Metadata } from 'next';
import { getLeadership } from '@/lib/api/company';
import { siteConfig } from '@/config/site';
import { routes } from '@/config/routes';

import LeadershipHero from '@/components/leadership/LeadershipHero';
import LeadershipDirectory from '@/components/leadership/LeadershipDirectory';
import LeadershipCtaBand from '@/components/leadership/LeadershipCtaBand';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Leadership & Governance | ${siteConfig.name}`,
  description:
    'Organized by function and domain accountability — connecting enterprise clients directly with practice masters and regional delivery directors.',
  alternates: {
    canonical: `${siteConfig.url}${routes.companyLeadership()}`,
  },
  openGraph: {
    title: `Leadership & Governance | ${siteConfig.name}`,
    description:
      'Organized by function and domain accountability — connecting enterprise clients directly with practice masters and regional delivery directors.',
    url: `${siteConfig.url}${routes.companyLeadership()}`,
    type: 'website',
  },
};

export default async function CompanyLeadershipPage() {
  const liveLeaders = await getLeadership().catch(() => []);

  return (
    <>
      {/* 1. Breadcrumb + Hero */}
      <LeadershipHero />

      {/* 2. Functional Directory (Tabs: Executive, Practices, Regions) */}
      <LeadershipDirectory liveLeaders={liveLeaders} />

      {/* 3. Persona-Routed CTA Band */}
      <LeadershipCtaBand />
    </>
  );
}
