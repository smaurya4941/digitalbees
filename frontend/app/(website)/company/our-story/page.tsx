import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { CTABand } from '@/components/sections/CTABand';
import { getCompanyMilestones } from '@/lib/api/company';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Our Story | ${siteConfig.name}`,
  description: siteConfig.description,
  alternates: { canonical: `${siteConfig.url}${routes.companyOurStory()}` },
};

export default async function OurStoryPage() {
  const milestones = await getCompanyMilestones();

  return (
    <>
      <PageHeader title="Our Story" breadcrumb="Company / Our Story" />

      <Section space="md">
        <Container width="narrow">
          <SectionHeading eyebrow="Our Story" title="Talent and technology, from the same partner" />
          <p className="mt-6 text-body-lg text-ink-muted">
            Most partners make you choose: a staffing firm that stops at the resume, or a delivery shop that stops at
            the project. TeamBees does both, under one roof, so the team that finds your specialists is the same team
            that can help them ship.
          </p>
          <p className="mt-4 text-body-lg text-ink-muted">
            That combination is organized into seven specialist practices — Talent Bees, Digital Bees, AI Bees,
            Marketing Bees, Quality Bees, ServiceNow Bees, and Energy Bees — each with its own delivery depth, working
            together across six regions: the USA, UK, Europe, Canada, Australia, and UAE.
          </p>
        </Container>
      </Section>

      {milestones.length > 0 && (
        <Section space="md" tone="sunken">
          <SectionHeading eyebrow="Timeline" title="How we got here" />
          <ol className="mt-12 flex flex-col gap-8 border-l border-hairline-strong pl-8">
            {milestones.map((milestone) => (
              <li key={milestone.id} className="relative">
                <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-gold" aria-hidden />
                <span className="text-eyebrow uppercase text-ink-muted">{milestone.year}</span>
                {milestone.title && <h3 className="mt-1 text-h4 text-ink">{milestone.title}</h3>}
                {milestone.description && <p className="mt-2 max-w-2xl text-body-md text-ink-muted">{milestone.description}</p>}
              </li>
            ))}
          </ol>
        </Section>
      )}

      <CTABand
        title="Want to know more about how we work?"
        description="See the practices, or talk to our team directly."
        cta={{ label: 'Explore our practices', url: routes.practices() }}
      />
    </>
  );
}
