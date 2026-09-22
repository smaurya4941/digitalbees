import type { Metadata } from 'next';
import { getCareers } from '@/lib/api/careers';
import { siteConfig } from '@/config/site';
import { routes } from '@/config/routes';

import CareersHero from '@/components/careers/CareersHero';
import CareersValues from '@/components/careers/CareersValues';
import CareersStories from '@/components/careers/CareersStories';
import CareersDni from '@/components/careers/CareersDni';
import CareersLnd from '@/components/careers/CareersLnd';
import CareersOpenRoles from '@/components/careers/CareersOpenRoles';
import CareersCtaBand from '@/components/careers/CareersCtaBand';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Careers at TeamBees | Life at TeamBees & Open Roles`,
  description:
    'Join a high-velocity collective delivering production AI, ServiceNow, and critical engineering across banking, healthcare, and energy.',
  alternates: {
    canonical: `${siteConfig.url}${routes.careers()}`,
  },
  openGraph: {
    title: `Careers at TeamBees | Life at TeamBees & Open Roles`,
    description:
      'Join a high-velocity collective delivering production AI, ServiceNow, and critical engineering across banking, healthcare, and energy.',
    url: `${siteConfig.url}${routes.careers()}`,
    type: 'website',
  },
};

export default async function CareersPage() {
  const liveRoles = await getCareers().catch(() => []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Careers at TeamBees Corp',
    description:
      'Join a high-velocity collective delivering production AI, ServiceNow, and critical engineering across banking, healthcare, and energy.',
    url: `${siteConfig.url}${routes.careers()}`,
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

      {/* 1. Hero: Real Diverse Employee Visual + Headline + Subhead */}
      <CareersHero />

      {/* 2. Values Grid: 4 Operating Discipline Pillars Reframed for Talent */}
      <CareersValues />

      {/* 3. Employee Story Cards: Sourced Stories with Staging Toggle */}
      <CareersStories />

      {/* 4. D&I Commitments: Concrete Pillars & Global Compliance Audits */}
      <CareersDni />

      {/* 5. Learning & Development: Production AI Upskilling Spotlight */}
      <CareersLnd />

      {/* 6. Open Roles Preview: Practice Filter & Structured Cards */}
      <CareersOpenRoles liveRoles={liveRoles} />

      {/* 7. Conversion CTA Band */}
      <CareersCtaBand />
    </>
  );
}
