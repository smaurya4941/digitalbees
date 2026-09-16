import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { LazyMap } from '@/components/contact/LazyMap';
import { CTABand } from '@/components/sections/CTABand';
import { getLocation, getLocations } from '@/lib/api/locations';
import { entityMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import type { LocationDetail } from '@/types/location';

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const locations = await getLocations();
  return locations
    .filter((l) => typeof l.slug === 'string' && l.slug.length > 0)
    .map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocation(slug);
  if (!location) return {};

  return entityMetadata({
    title: `${location.name} | Locations`,
    description: [location.address, location.city, location.country]
      .filter(Boolean)
      .join(', '),
    path: routes.location(location.slug),
    siteUrl: siteConfig.url,
  });
}

/** `LocalBusiness` structured data — required on every location page (§6.3). */
function localBusinessSchema(location: LocationDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: location.name,
    parentOrganization: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.address,
      addressLocality: location.city,
      addressCountry: location.country,
    },
    ...(location.lat != null && location.lng != null
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: location.lat,
            longitude: location.lng,
          },
        }
      : {}),
  };
}

export default async function LocationPage({ params }: Params) {
  const { slug } = await params;
  const location = await getLocation(slug);

  if (!location) notFound();

  const address = [location.address, location.city, location.country]
    .filter(Boolean)
    .join(', ');

  const hasCoords = location.lat != null && location.lng != null;

  return (
    <>
      <JsonLd data={localBusinessSchema(location)} />

      <div className="bg-canvas py-4">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: routes.home() },
              { label: 'Locations', href: routes.locations() },
              { label: location.name, href: routes.location(location.slug) },
            ]}
          />
        </Container>
      </div>

      <Section space="md">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow={location.region ?? 'Location'}
              title={location.name}
              as="h2"
            />
            {address && (
              <address className="mt-6 not-italic text-body-lg text-ink-muted">
                {address}
              </address>
            )}
          </div>

          {hasCoords && (
            <div className="min-h-[400px] overflow-hidden rounded-[2rem]">
              <LazyMap
                offices={[
                  {
                    name: location.name,
                    locality: [location.city, location.country].filter(Boolean).join(', '),
                    position: [location.lat as number, location.lng as number],
                  },
                ]}
              />
            </div>
          )}
        </div>
      </Section>

      <CTABand title={`Work with our ${location.city ?? location.name} team`} />
    </>
  );
}
