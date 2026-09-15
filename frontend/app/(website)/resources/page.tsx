import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { CTABand } from '@/components/sections/CTABand';
import { getResources } from '@/lib/api/resources';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Resources | ${siteConfig.name}`,
  description:
    'Guides, benchmark reports, webinars and research from TeamBees — practical reference material for hiring and delivery leaders.',
  alternates: { canonical: `${siteConfig.url}${routes.resources()}` },
};

export default async function ResourcesHubPage() {
  const { items } = await getResources();

  return (
    <>
      <PageHeader title="Resources" breadcrumb="Resources" />

      <Section space="md">
        <SectionHeading
          eyebrow="Resources"
          title="Guides, research and recordings"
          description="Longer-form reference material — compliance guides, benchmark data and webinar recordings."
        />
        {items.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((resource) => (
              <ResourceCard key={resource.slug} resource={resource} />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-12"
            title="No resources published yet"
            description="Guides and benchmark reports are in production. Ask us directly and we’ll share what we have."
            action={{ label: 'Talk to our team', href: routes.contact() }}
          />
        )}
      </Section>

      <CTABand />
    </>
  );
}
