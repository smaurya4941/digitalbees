import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { SeoJsonLd } from '@/components/seo/JsonLd';
import { Hero } from '@/components/sections/Hero';
import { ProofBar } from '@/components/sections/ProofBar';
import { WhatsIncludedList } from '@/components/sections/WhatsIncludedList';
import { CaseStudyGrid } from '@/components/sections/CaseStudyGrid';
import { CTABand } from '@/components/sections/CTABand';
import { routes } from '@/config/routes';
import type { SubServiceDetail } from '@/types/practice';

type SubServiceTemplateProps = {
  subService: SubServiceDetail;
};

/**
 * The `sub-service` template (blueprint §22.3) — deliberately leaner than
 * PracticeTemplate: hero, 2 proof points, a "what's included" list, one case
 * study, and a single CTA. Renders from structured data alone, same pattern
 * as every other template in this codebase.
 */
export function SubServiceTemplate({ subService }: SubServiceTemplateProps) {
  const practice = subService.practice;

  const breadcrumbs = practice
    ? [
        { label: 'Home', href: routes.home() },
        { label: 'Practices', href: routes.practices() },
        { label: practice.name, href: routes.practice(practice.slug) },
        { label: subService.name, href: subService.href ?? routes.practices() },
      ]
    : [
        { label: 'Home', href: routes.home() },
        { label: 'Practices', href: routes.practices() },
        { label: subService.name, href: subService.href ?? routes.practices() },
      ];

  return (
    <>
      <SeoJsonLd seo={subService.seo} />

      <div className="bg-canvas py-4">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      </div>

      <Hero content={subService.hero} />

      <ProofBar points={subService.proof_points} heading={`${subService.name} — proof`} />

      <WhatsIncludedList items={subService.whats_included} />

      <CaseStudyGrid
        caseStudies={subService.case_study ? [subService.case_study] : []}
        eyebrow="Proof"
        title={`${subService.name} in practice`}
        columns={2}
      />

      <CTABand title={`Ready to move on ${subService.name}?`} cta={subService.cta} />
    </>
  );
}
