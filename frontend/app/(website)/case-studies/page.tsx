import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { CaseStudyCard } from '@/components/cards/CaseStudyCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { CTABand } from '@/components/sections/CTABand';
import { getCaseStudies } from '@/lib/api/case-studies';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Case Studies | ${siteConfig.name}`,
  description:
    'Quantified outcomes from TeamBees engagements across banking, healthcare, energy, SaaS and the public sector.',
  alternates: { canonical: `${siteConfig.url}${routes.caseStudies()}` },
};

export default async function CaseStudiesHubPage() {
  const caseStudies = await getCaseStudies();

  return (
    <>
      <PageHeader title="Case Studies" breadcrumb="Case Studies" />

      <Section space="md">
        <SectionHeading
          eyebrow="Proof"
          title="Outcomes, not capability claims"
          description="Every study leads with a number, names the constraint, and says what we actually did."
        />
        {caseStudies.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-12"
            title="Case studies are being published"
            description="Client sign-off is in progress on the first set. Ask us for the relevant references in the meantime."
            action={{ label: 'Request references', href: routes.contact() }}
          />
        )}
      </Section>

      <CTABand title="Get results like this" />
    </>
  );
}
