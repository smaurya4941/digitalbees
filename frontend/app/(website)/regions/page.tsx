import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { ContentCard } from '@/components/cards/ContentCard';
import { CTABand } from '@/components/sections/CTABand';
import { getRegions } from '@/lib/api/regions';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Regions | ${siteConfig.name}`,
  description:
    'TeamBees delivers across the USA, UK, Europe, Canada, Australia and the UAE — with local teams who understand local compliance.',
  alternates: { canonical: `${siteConfig.url}${routes.regions()}` },
};

export default async function RegionsHubPage() {
  const regions = await getRegions();

  return (
    <>
      {/* PageHeader renders the hub's own breadcrumb trail. */}
      <PageHeader title="Regions" breadcrumb="Regions" />

      <Section space="md">
        <SectionHeading
          eyebrow="Regions"
          title="Local enough to matter, global enough to scale"
          description="Compliance does not work the same way in London as it does in Dubai. Our regional teams know the difference."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regions.map((region) => (
            <ContentCard key={region.id} item={region} eyebrow="Region" />
          ))}
        </div>
      </Section>

      <CTABand />
    </>
  );
}
