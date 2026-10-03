import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Card, CardBody, CardDescription, CardEyebrow, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { CTABand } from '@/components/sections/CTABand';
import { getLocations } from '@/lib/api/locations';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { getCompanyFacts } from '@/lib/api/settings';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { marketsLabel } = await getCompanyFacts();

  return {
    title: `Locations | ${siteConfig.name}`,
    description: `TeamBees offices and delivery teams in ${marketsLabel}.`,
    alternates: { canonical: `${siteConfig.url}${routes.locations()}` },
  };
}

export default async function LocationsHubPage() {
  const [locations, facts] = await Promise.all([getLocations(), getCompanyFacts()]);

  return (
    <>
      <PageHeader title="Locations" breadcrumb="Locations" />

      <Section space="md">
        <SectionHeading
          eyebrow="Locations"
          title="Where you’ll find us"
          description="Local teams in every region we serve — because compliance and hiring practice differ in each."
        />
        {locations.length > 0 ? (
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <li key={location.slug}>
                <Card href={location.href} ariaLabel={location.name} interactive>
                  <CardBody>
                    {location.region && <CardEyebrow>{location.region}</CardEyebrow>}
                    <CardTitle>{location.name}</CardTitle>
                    {(location.city || location.country) && (
                      <CardDescription>
                        {[location.city, location.country].filter(Boolean).join(', ')}
                      </CardDescription>
                    )}
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            className="mt-12"
            title="Office details are being published"
            description={`We deliver from ${facts.marketsLabel}. Tell us where you are and we’ll connect you with the right team.`}
            action={{ label: 'Contact us', href: routes.contact() }}
          />
        )}
      </Section>

      <CTABand />
    </>
  );
}
