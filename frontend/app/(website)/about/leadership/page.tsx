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
    canonical: `${siteConfig.url}${routes.aboutLeadership()}`,
  },
  openGraph: {
    title: `Leadership & Governance | ${siteConfig.name}`,
    description:
      'Organized by function and domain accountability — connecting enterprise clients directly with practice masters and regional delivery directors.',
    url: `${siteConfig.url}${routes.aboutLeadership()}`,
    type: 'website',
  },
};

export default async function AboutLeadershipPage() {
  const liveLeaders = await getLeadership().catch(() => []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'TeamBees Leadership & Governance',
    description:
      'Organized by function and domain accountability — connecting enterprise clients directly with practice masters and regional delivery directors.',
    url: `${siteConfig.url}${routes.aboutLeadership()}`,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Breadcrumb + Hero */}
      <LeadershipHero />

      {/* 2. Functional Directory (Tabs: Executive, Practices, Regions) */}
      <LeadershipDirectory liveLeaders={liveLeaders} />

      {/* 3. Persona-Routed CTA Band */}
      <LeadershipCtaBand />
    </>
  );
}
