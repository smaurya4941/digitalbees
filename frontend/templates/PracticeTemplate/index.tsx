import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { SeoJsonLd } from '@/components/seo/JsonLd';
import { Hero } from '@/components/sections/Hero';
import { ProofBar } from '@/components/sections/ProofBar';
import { ServiceGrid } from '@/components/sections/ServiceGrid';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { RelatedContent } from '@/components/sections/RelatedContent';
import { StackTable } from '@/components/sections/StackTable';
import { TechnicalCapabilities } from '@/components/sections/TechnicalCapabilities';
import { ServiceNowFit } from '@/components/sections/ServiceNowFit';
import { CaseStudyGrid } from '@/components/sections/CaseStudyGrid';
import { RelatedPractices } from '@/components/sections/RelatedPractices';
import { CTABand } from '@/components/sections/CTABand';
import { routes } from '@/config/routes';
import type { PracticeDetail } from '@/types/practice';
import type { EntitySummary } from '@/types/content';

type PracticeTemplateProps = {
  practice: PracticeDetail;
};

/** Maps the plain {title,description} key-capability shape onto EntitySummary so it can reuse RelatedContent's card grid. */
function toEntitySummary(capabilities: PracticeDetail['key_capabilities']): EntitySummary[] {
  return (capabilities ?? []).map((capability, index) => ({
    id: index,
    slug: capability.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: capability.title,
    summary: capability.description,
    href: '',
  }));
}

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

      <RelatedContent
        items={toEntitySummary(practice.key_capabilities)}
        eyebrow="Key capabilities"
        title={`What ${practice.name} builds`}
        columns={4}
      />

      <ProcessSteps steps={practice.how_we_work} />

      <StackTable
        rows={practice.framework_stack ?? []}
        agentCapabilities={practice.agent_capabilities ?? []}
      />

      <TechnicalCapabilities capabilities={practice.technical_capabilities ?? []} />

      <ServiceNowFit fit={practice.servicenow_fit} />

      <CaseStudyGrid
        caseStudies={practice.case_studies}
        eyebrow="Proof"
        title={`${practice.name} in production`}
      />

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
