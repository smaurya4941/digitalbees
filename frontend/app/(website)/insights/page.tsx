import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { CTABand } from '@/components/sections/CTABand';
import { getInsights } from '@/lib/api/resources';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Insights | ${siteConfig.name}`,
  description:
    'Points of view on AI delivery, ServiceNow, quality engineering, energy trading platforms and global hiring compliance.',
  alternates: { canonical: `${siteConfig.url}${routes.insights()}` },
};

export default async function InsightsHubPage() {
  const { items } = await getInsights();

  return (
    <>
      <PageHeader title="Insights" breadcrumb="Insights" />

      <Section space="md">
        <SectionHeading
          eyebrow="Insights"
          title="What our delivery leads are seeing"
          description="Written by the people doing the work — practice leads and delivery specialists, not a content desk."
        />
        {items.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((insight) => (
              <ResourceCard key={insight.slug} resource={insight} />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-12"
            title="No articles published yet"
            description="The editorial calendar is spinning up. Tell us what you’re working on and we’ll point you at the right specialist."
            action={{ label: 'Talk to our team', href: routes.contact() }}
          />
        )}
      </Section>

      <CTABand />
    </>
  );
}
