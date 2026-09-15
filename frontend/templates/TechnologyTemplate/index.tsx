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
import type { TechnologyDetail } from '@/types/technology';

type TechnologyTemplateProps = {
  technology: TechnologyDetail;
};

/**
 * The `technology` template. Platform-name searches are typically further down
 * the funnel than practice searches (blueprint §24.1), so this page leads with
 * capability and proof rather than explanation.
 */
export function TechnologyTemplate({ technology }: TechnologyTemplateProps) {
  const breadcrumbs = [
    { label: 'Home', href: routes.home() },
    { label: 'Technologies', href: routes.technologies() },
    { label: technology.name, href: routes.technology(technology.slug) },
  ];

  return (
    <>
      <SeoJsonLd seo={technology.seo} />

      <div className="bg-canvas py-4">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      </div>

      <Hero content={technology.hero} />

      <ProofBar points={technology.proof_points} heading={`${technology.name} — proof`} />

      <RelatedPractices
        practices={technology.practices}
        title={`What we build on ${technology.name}`}
      />

      <RelatedContent
        items={technology.industries}
        eyebrow="Industries"
        title={`Where we deliver ${technology.name}`}
        itemEyebrow="Industry"
        columns={3}
      />

      <CaseStudyGrid
        caseStudies={technology.case_studies}
        eyebrow="Proof"
        title={`Built with ${technology.name}`}
        tone="sunken"
      />

      <CTABand
        title={`Talk to a ${technology.name} specialist`}
        cta={technology.hero.cta}
      />
    </>
  );
}
