import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { SeoJsonLd } from '@/components/seo/JsonLd';
import { Hero } from '@/components/sections/Hero';
import { ProofBar } from '@/components/sections/ProofBar';
import { ServiceGrid } from '@/components/sections/ServiceGrid';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { RelatedContent } from '@/components/sections/RelatedContent';
import { RelatedPractices } from '@/components/sections/RelatedPractices';
import { CTABand } from '@/components/sections/CTABand';
import { routes } from '@/config/routes';
import type { PracticeDetail } from '@/types/practice';

type PracticeTemplateProps = {
  practice: PracticeDetail;
};

/**
 * The `practice` template. Renders any practice from structured data alone —
 * it has no knowledge of which practice or where the data came from. All seven
 * practices (and any added later) render through this one component.
 */
export function PracticeTemplate({ practice }: PracticeTemplateProps) {
  const breadcrumbs = [
    { label: 'Home', href: routes.home() },
    { label: 'Practices', href: routes.practices() },
    { label: practice.name, href: routes.practice(practice.slug) },
  ];

  return (
    <>
      <SeoJsonLd seo={practice.seo} />

      <div className="bg-canvas py-4">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      </div>

      <Hero content={practice.hero} />

      <ProofBar points={practice.proof_points} heading={`${practice.name} — proof`} />

      <ServiceGrid
        services={practice.services}
        title={`${practice.name} service lines`}
        description={practice.hero.description ?? undefined}
      />

      <ProcessSteps steps={practice.how_we_work} />

      <RelatedContent
        items={practice.industries}
        eyebrow="Industries"
        title={`Where ${practice.name} delivers`}
        itemEyebrow="Industry"
        columns={3}
      />

      <RelatedContent
        items={practice.technologies}
        eyebrow="Technologies"
        title="Platforms and tools we build on"
        itemEyebrow="Technology"
        tone="sunken"
        columns={4}
      />

      <RelatedContent
        items={practice.regions}
        eyebrow="Regions"
        title="Delivery regions"
        itemEyebrow="Region"
        columns={3}
      />

      <RelatedPractices practices={practice.related_practices} />

      <CTABand
        title={`Ready to move on ${practice.name}?`}
        cta={practice.hero.cta}
      />
    </>
  );
}
