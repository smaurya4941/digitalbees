import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { ContentCard } from '@/components/cards/ContentCard';
import { CTABand } from '@/components/sections/CTABand';
import { EmptyState } from '@/components/ui/EmptyState';
import { getTechnologies } from '@/lib/api/technologies';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Technologies | ${siteConfig.name}`,
  description:
    'The platforms TeamBees delivers on — cloud, data, AI, ServiceNow and energy trading systems.',
  alternates: { canonical: `${siteConfig.url}${routes.technologies()}` },
};

export default async function TechnologiesHubPage() {
  const technologies = await getTechnologies();

  return (
    <>
      <PageHeader title="Technologies" breadcrumb="Technologies" />

      <Section space="md">
        <SectionHeading
          eyebrow="Technologies"
          title="Named platform depth, not a logo wall"
          description="Buyers searching by platform usually have a scoped project. These are the systems our teams are certified and delivery-tested on."
        />
        {technologies.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {technologies.map((technology) => (
              <ContentCard key={technology.id} item={technology} eyebrow="Technology" />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-12"
            title="Technology pages are on the way"
            description="We’re publishing platform pages now. In the meantime, tell us which platform you’re working with."
            action={{ label: 'Talk to a specialist', href: routes.contact() }}
          />
        )}
      </Section>

      <CTABand />
    </>
  );
}
