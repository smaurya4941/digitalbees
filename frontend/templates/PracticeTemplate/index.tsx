import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { SeoJsonLd } from '@/components/seo/JsonLd';
import { Hero } from '@/components/sections/Hero';
import { ProofBar } from '@/components/sections/ProofBar';
import { ServiceGrid } from '@/components/sections/ServiceGrid';
import { RelatedContent } from '@/components/sections/RelatedContent';
import { StackTable } from '@/components/sections/StackTable';
import { TechnicalCapabilities } from '@/components/sections/TechnicalCapabilities';
import { ServiceNowFit } from '@/components/sections/ServiceNowFit';
import { CaseStudyGrid } from '@/components/sections/CaseStudyGrid';
import { RelatedPractices } from '@/components/sections/RelatedPractices';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { CTABand } from '@/components/sections/CTABand';
import { CapabilityGrid } from '@/components/teambees/CapabilityGrid';
import { WorkflowSteps } from '@/components/teambees/WorkflowSteps';
import { TechnologyGrid } from '@/components/teambees/TechnologyGrid';
import { IndustryChips } from '@/components/teambees/IndustryChips';
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

      <CapabilityGrid
        capabilities={practice.key_capabilities ?? []}
        eyebrow="Key capabilities"
        title={`What ${practice.name} builds`}
      />

      <WorkflowSteps steps={practice.how_we_work} />

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

      <IndustryChips industries={practice.industries} title={`Where ${practice.name} delivers`} />

      <TechnologyGrid technologies={practice.technologies} title="Platforms and tools we build on" />

      <RelatedContent
        items={practice.regions}
        eyebrow="Regions"
        title="Delivery regions"
        itemEyebrow="Region"
        columns={3}
      />

      <RelatedPractices practices={practice.related_practices} />

      <FaqAccordion faqs={practice.faqs} title={`${practice.name} — frequently asked questions`} />

      <CTABand
        title={`Ready to move on ${practice.name}?`}
        cta={practice.hero.cta}
      />
    </>
  );
}
