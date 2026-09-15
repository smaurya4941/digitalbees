import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Card, CardBody } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { CTABand } from '@/components/sections/CTABand';
import { getPartnerships } from '@/lib/api/company';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import type { Partner } from '@/types/company';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Partnerships & Certifications | ${siteConfig.name}`,
  description: 'Technology, alliance, and certification partners TeamBees Corp works with.',
  alternates: { canonical: `${siteConfig.url}${routes.companyPartnerships()}` },
};

const TYPE_LABEL: Record<Partner['partner_type'], string> = {
  technology: 'Technology Partner',
  alliance: 'Alliance Partner',
  certification: 'Certification',
};

export default async function PartnershipsPage() {
  const partners = await getPartnerships();

  return (
    <>
      <PageHeader title="Partnerships & Certifications" breadcrumb="Company / Partnerships" />

      <Section space="md">
        <SectionHeading
          eyebrow="Partnerships & Certifications"
          title="Who we build with"
          description="Technology partnerships, delivery alliances, and platform certifications behind our practice depth."
        />

        {partners.length > 0 ? (
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((partner) => (
              <li key={partner.id}>
                <Card href={partner.url ?? undefined} ariaLabel={partner.name} interactive={Boolean(partner.url)}>
                  <CardBody className="items-center text-center">
                    {partner.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted media, host unknown at build time.
                      <img src={partner.logo_url} alt={partner.name} loading="lazy" className="h-12 object-contain" />
                    ) : (
                      <span className="text-h4 text-ink">{partner.name}</span>
                    )}
                    <span className="mt-3 text-body-sm text-ink-muted">{TYPE_LABEL[partner.partner_type]}</span>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            className="mt-12"
            title="Partnership details coming soon"
            description="We're finalizing this page. If you're evaluating our platform certifications for a specific practice, ask us directly."
            action={{ label: 'Talk to a specialist', href: routes.contact() }}
          />
        )}
      </Section>

      <CTABand
        title="Evaluating a specific platform?"
        description="Tell us which platform or certification matters for your project."
        cta={{ label: 'Talk to a platform specialist', url: routes.contact() }}
      />
    </>
  );
}
