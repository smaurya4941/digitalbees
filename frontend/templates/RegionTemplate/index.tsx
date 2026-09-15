import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { SeoJsonLd } from '@/components/seo/JsonLd';
import { Hero } from '@/components/sections/Hero';
import { ProofBar } from '@/components/sections/ProofBar';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { RelatedPractices } from '@/components/sections/RelatedPractices';
import { CTABand } from '@/components/sections/CTABand';
import { routes } from '@/config/routes';
import type { RegionDetail } from '@/types/region';

type RegionTemplateProps = {
  region: RegionDetail;
};

/**
 * The `region` template — one component behind every `/regions/{slug}` page.
 *
 * Note: the blueprint also calls for a per-region compliance snapshot (IR35,
 * Emiratization, GDPR, …). That copy makes regulatory claims, which the
 * blueprint requires legal to review before publish, so it is authored as CMS
 * content rather than hardcoded here — this template will render it once the
 * region payload carries it.
 */
export function RegionTemplate({ region }: RegionTemplateProps) {
  const breadcrumbs = [
    { label: 'Home', href: routes.home() },
    { label: 'Regions', href: routes.regions() },
    { label: region.name, href: routes.region(region.slug) },
  ];

  return (
    <>
      <SeoJsonLd seo={region.seo} />

      <div className="bg-canvas py-4">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      </div>

      <Hero content={region.hero} />

      <ProofBar points={region.proof_points} heading={`${region.name} — proof`} />

      <RelatedPractices
        practices={region.practices}
        title={`Practices delivered in ${region.name}`}
      />

      {region.locations.length > 0 && (
        <Section space="md">
          <SectionHeading
            eyebrow="Locations"
            title={`Where we are in ${region.name}`}
          />
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {region.locations.map((location) => (
              <li
                key={location.id}
                className="rounded-lg border border-hairline bg-canvas-raised p-6"
              >
                <h3 className="text-h3 text-ink">{location.name}</h3>
                <address className="mt-2 not-italic text-body-md text-ink-muted">
                  {[location.address, location.city, location.country]
                    .filter(Boolean)
                    .join(', ')}
                </address>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CTABand title={`Hire and build in ${region.name}`} cta={region.hero.cta} />
    </>
  );
}
