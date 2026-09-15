import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Card, CardBody } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { CTABand } from '@/components/sections/CTABand';
import { getLeadership } from '@/lib/api/company';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Leadership | ${siteConfig.name}`,
  description: 'The team leading TeamBees Corp across talent, delivery, and technology.',
  alternates: { canonical: `${siteConfig.url}${routes.companyLeadership()}` },
};

export default async function LeadershipPage() {
  const leaders = await getLeadership();

  return (
    <>
      <PageHeader title="Leadership" breadcrumb="Company / Leadership" />

      <Section space="md">
        <SectionHeading
          eyebrow="Leadership"
          title="The team behind TeamBees"
          description="Real photos and bios, organized by function — so you can find the right leader for your region or practice."
        />

        {leaders.length > 0 ? (
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((leader) => (
              <li key={leader.id}>
                <Card>
                  <CardBody>
                    {leader.photo_url && (
                      // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted media, host unknown at build time.
                      <img
                        src={leader.photo_url}
                        alt={leader.name}
                        loading="lazy"
                        className="mb-4 h-20 w-20 rounded-full object-cover"
                      />
                    )}
                    <h3 className="text-h4 text-ink">{leader.name}</h3>
                    {leader.title && <p className="text-body-sm font-medium text-brand-navy">{leader.title}</p>}
                    {leader.bio && <p className="mt-2 text-body-sm text-ink-muted">{leader.bio}</p>}
                    {leader.linkedin_url && (
                      <a
                        href={leader.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${leader.name} on LinkedIn`}
                        className="mt-3 inline-block text-body-sm text-ink-muted underline hover:text-brand-navy"
                      >
                        LinkedIn
                      </a>
                    )}
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            className="mt-12"
            title="Leadership bios coming soon"
            description="Our leadership page is being finalized. In the meantime, get in touch and we'll connect you with the right person directly."
            action={{ label: 'Contact us', href: routes.contact() }}
          />
        )}
      </Section>

      <CTABand
        title="Want to talk to a specific leader?"
        description="Tell us what you're working on and we'll route you to the right person."
        cta={{ label: 'Get in touch', url: routes.contact() }}
      />
    </>
  );
}
