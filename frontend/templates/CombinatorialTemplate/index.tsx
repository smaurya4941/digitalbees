import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { SeoJsonLd } from '@/components/seo/JsonLd';
import { Hero } from '@/components/sections/Hero';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { CaseStudyGrid } from '@/components/sections/CaseStudyGrid';
import { CTABand } from '@/components/sections/CTABand';
import { routes } from '@/config/routes';
import type { ResolvedPage } from '@/types/page';

type CombinatorialTemplateProps = {
  page: ResolvedPage;
  /** Which parent collection the primary entity belongs to — decides the breadcrumb trail. */
  parentCollection: 'industries' | 'regions';
};

/**
 * Shared template for curated Practice x Industry / Region x Practice pages
 * (blueprint §23.2): a narrower combination page than either parent hub —
 * hero naming both entities explicitly, a "why this combination matters"
 * paragraph (unique per page, never templated boilerplate — see the
 * anti-thin-content rule in blueprint §7.2), one relevant case study, and a
 * single CTA. One component renders every curated pair; the content that
 * makes each page genuinely different lives in the seeded `page_sections`
 * rows, not in this component.
 */
export function CombinatorialTemplate({ page, parentCollection }: CombinatorialTemplateProps) {
  const primary = page.primary_entity;
  const secondary = page.secondary_entity;

  const heroSection = (page.sections.hero ?? {}) as { eyebrow?: string; title?: string; description?: string };
  const whyItMatters = (page.sections.why_it_matters ?? {}) as { body?: string };

  const primaryName = primary?.name ?? '';
  const secondaryName = secondary?.name ?? '';

  const heroContent = {
    eyebrow: heroSection.eyebrow ?? primaryName,
    title: heroSection.title ?? `${secondaryName} for ${primaryName}`,
    description: heroSection.description ?? null,
    cta: { label: 'Talk to a Specialist', url: routes.contact() },
    secondary_cta: secondary
      ? { label: `Explore all of ${secondaryName}`, url: `/practices/${secondary.slug}` }
      : null,
  };

  const parentHref = parentCollection === 'industries' ? routes.industries() : routes.regions();
  const parentLabel = parentCollection === 'industries' ? 'Industries' : 'Regions';
  const primaryHref = primary
    ? parentCollection === 'industries'
      ? routes.industry(primary.slug)
      : routes.region(primary.slug)
    : parentHref;

  const breadcrumbs = [
    { label: 'Home', href: routes.home() },
    { label: parentLabel, href: parentHref },
    { label: primaryName, href: primaryHref },
    { label: secondaryName, href: page.url_path },
  ];

  return (
    <>
      <SeoJsonLd seo={page.seo} />

      <div className="bg-canvas py-4">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      </div>

      <Hero content={heroContent} />

      {whyItMatters.body && (
        <Section space="md">
          <SectionHeading eyebrow="Why this matters" title={`${secondaryName} built for ${primaryName}`} />
          <p className="mt-6 max-w-3xl text-body-lg text-ink-muted">{whyItMatters.body}</p>
        </Section>
      )}

      <CaseStudyGrid
        caseStudies={page.case_studies}
        eyebrow="Proof"
        title={`${secondaryName} results in ${primaryName}`}
        columns={2}
      />

      <CTABand
        title={`Ready to move on ${secondaryName} for ${primaryName}?`}
        cta={{ label: 'Talk to a Specialist', url: routes.contact() }}
      />
    </>
  );
}
