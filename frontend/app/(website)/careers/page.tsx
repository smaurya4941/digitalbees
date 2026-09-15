import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Card, CardBody, CardDescription, CardEyebrow, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { CTABand } from '@/components/sections/CTABand';
import { getCareers } from '@/lib/api/careers';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import type { JobLocation } from '@/types/career';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Careers | ${siteConfig.name}`,
  description:
    'Open roles at TeamBees — global projects across AI, ServiceNow, quality engineering and energy trading platforms.',
  alternates: { canonical: `${siteConfig.url}${routes.careers()}` },
};

function locationLabel(location?: JobLocation | null): string | null {
  if (!location) return null;
  const parts = [location.city, location.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : (location.name ?? null);
}

export default async function CareersHubPage() {
  const roles = await getCareers();

  return (
    <>
      <PageHeader title="Careers" breadcrumb="Careers" />

      <Section space="md">
        {/*
          §1.6: candidate-facing copy stays warmer and more personal than the
          enterprise-buyer register used elsewhere on the site.
        */}
        <SectionHeading
          eyebrow="Careers"
          title="Join a team building what’s next"
          description="Real projects for banking, healthcare, energy and SaaS clients — with the training and mobility to keep growing into them."
        />
        {roles.length > 0 ? (
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => {
              const place = locationLabel(role.location);
              return (
                <li key={role.slug}>
                  <Card href={role.href} ariaLabel={role.title} interactive>
                    <CardBody>
                      <CardEyebrow>{role.employment_type ?? 'Open role'}</CardEyebrow>
                      <CardTitle>{role.title}</CardTitle>
                      {place && <CardDescription>{place}</CardDescription>}
                    </CardBody>
                  </Card>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            className="mt-12"
            title="No open roles right now"
            description="We hire continuously across all seven practices. Send us your details and we’ll reach out when something fits."
            action={{ label: 'Join our talent community', href: routes.contact() }}
          />
        )}
      </Section>

      <Section space="md" tone="sunken">
        <SectionHeading
          eyebrow="Life at TeamBees"
          title="What you can expect"
          description="Global project exposure, upskilling in AI and modern platforms, and a real career path rather than a placement."
        />
        <p className="mt-6 max-w-2xl text-body-md text-ink-muted">
          Questions about the process?{' '}
          <Link href={routes.contact()} className="underline hover:text-ink">
            Talk to our talent team
          </Link>
          .
        </p>
      </Section>

      <CTABand
        title="Don’t see your role?"
        description="Tell us what you do and where you want to take it. We’ll let you know when there’s a fit."
        cta={{ label: 'Get in touch', url: routes.contact() }}
      />
    </>
  );
}
