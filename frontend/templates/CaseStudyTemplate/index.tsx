import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { SeoJsonLd } from '@/components/seo/JsonLd';
import { Hero } from '@/components/sections/Hero';
import { ProofBar } from '@/components/sections/ProofBar';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { RelatedContent } from '@/components/sections/RelatedContent';
import { RelatedPractices } from '@/components/sections/RelatedPractices';
import { CTABand } from '@/components/sections/CTABand';
import { routes } from '@/config/routes';
import type { CaseStudyDetail } from '@/types/case-study';

type CaseStudyTemplateProps = {
  caseStudy: CaseStudyDetail;
};

/**
 * The `case-study` template. Blueprint §25.1 fixes this structure for every
 * case study, no exceptions — header → headline result → challenge → approach
 * → results → related → CTA — so studies stay comparable and syndicatable.
 */
export function CaseStudyTemplate({ caseStudy }: CaseStudyTemplateProps) {
  const breadcrumbs = [
    { label: 'Home', href: routes.home() },
    { label: 'Case Studies', href: routes.caseStudies() },
    { label: caseStudy.title, href: routes.caseStudy(caseStudy.slug) },
  ];

  // §25.1 step 2: the quantified outcome is the page's hero stat.
  const proofPoints = caseStudy.metrics.map((metric) => ({
    value: metric.value,
    label: metric.label,
  }));

  const narrative = [
    { heading: 'The challenge', body: caseStudy.challenge },
    { heading: 'Our approach', body: caseStudy.solution },
    { heading: 'The results', body: caseStudy.results },
  ].filter((block): block is { heading: string; body: string } => Boolean(block.body));

  return (
    <>
      <SeoJsonLd seo={caseStudy.seo} />

      <div className="bg-canvas py-4">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      </div>

      <Hero content={caseStudy.hero} />

      <ProofBar points={proofPoints} heading="Results at a glance" />

      {narrative.map((block) => (
        <Section key={block.heading} space="md">
          <div className="max-w-3xl">
            <SectionHeading title={block.heading} as="h2" />
            <p className="mt-6 text-body-lg text-ink-muted">{block.body}</p>
          </div>
        </Section>
      ))}

      <RelatedPractices
        practices={caseStudy.practices}
        title="Practices behind this work"
      />

      <RelatedContent
        items={caseStudy.industries}
        eyebrow="Industry"
        title="Industry context"
        itemEyebrow="Industry"
        columns={3}
      />

      <RelatedContent
        items={caseStudy.technologies}
        eyebrow="Technologies"
        title="Built with"
        itemEyebrow="Technology"
        tone="sunken"
        columns={4}
      />

      <RelatedContent
        items={caseStudy.regions}
        eyebrow="Regions"
        title="Delivered from"
        itemEyebrow="Region"
        columns={3}
      />

      {/* §33.1: the case-study CTA is "Get results like this". */}
      <CTABand title="Get results like this" cta={caseStudy.hero.cta} />
    </>
  );
}
