import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { ContentCard } from '@/components/cards/ContentCard';
import { CTABand } from '@/components/sections/CTABand';
import { getIndustries } from '@/lib/api/industries';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Industries | ${siteConfig.name}`,
  description:
    'The verticals TeamBees serves — from banking and healthcare to energy, public sector and logistics.',
  alternates: { canonical: `${siteConfig.url}${routes.industries()}` },
};

export default async function IndustriesHubPage() {
  const industries = await getIndustries();

  return (
    <>
      {/* PageHeader renders the hub's own breadcrumb trail. */}
      <PageHeader title="Industries" breadcrumb="Industries" />

      <Section space="md">
        <SectionHeading
          eyebrow="Industries"
          title="Sector depth, not generic delivery"
          description="Every industry brings its own regulatory reality and legacy estate. These are the verticals where we already know them."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <ContentCard key={industry.id} item={industry} eyebrow="Industry" />
          ))}
        </div>
      </Section>

      <CTABand />
    </>
  );
}
