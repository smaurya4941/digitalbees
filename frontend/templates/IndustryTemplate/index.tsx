import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { SeoJsonLd } from '@/components/seo/JsonLd';
import { Hero } from '@/components/sections/Hero';
import { ProofBar } from '@/components/sections/ProofBar';
import { RelatedContent } from '@/components/sections/RelatedContent';
import { RelatedPractices } from '@/components/sections/RelatedPractices';
import { CaseStudyGrid } from '@/components/sections/CaseStudyGrid';
import { CTABand } from '@/components/sections/CTABand';
import { routes } from '@/config/routes';
import type { IndustryDetail } from '@/types/industry';

type IndustryTemplateProps = {
  industry: IndustryDetail;
};

/**
 * The `industry` template. Renders any industry from structured data alone, the
 * same way {@link PracticeTemplate} does for practices — one component behind
 * every `/industries/{slug}` page.
 */
export function IndustryTemplate({ industry }: IndustryTemplateProps) {
  const breadcrumbs = [
    { label: 'Home', href: routes.home() },
    { label: 'Industries', href: routes.industries() },
    { label: industry.name, href: routes.industry(industry.slug) },
  ];

  return (
    <>
      <SeoJsonLd seo={industry.seo} />

      <div className="bg-canvas pb-4 pt-[88px] md:pt-[120px]">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      </div>

      <Hero content={industry.hero} />

      <ProofBar points={industry.proof_points} heading={`${industry.name} — proof`} />

      <RelatedPractices
        practices={industry.practices}
        title={`How we serve ${industry.name}`}
      />

      <RelatedContent
        items={industry.technologies}
        eyebrow="Technologies"
        title="Platforms we deliver on"
        itemEyebrow="Technology"
        tone="sunken"
        columns={4}
      />

      <CaseStudyGrid
        caseStudies={industry.case_studies}
        eyebrow="Proof"
        title={`${industry.name} results we have delivered`}
      />

      <CTABand
        title={`Talk to a ${industry.name} specialist`}
        cta={industry.hero.cta}
      />
    </>
  );
}
