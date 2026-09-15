import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { JobApplicationForm } from '@/components/careers/JobApplicationForm';
import { CTABand } from '@/components/sections/CTABand';
import { getCareer, getCareers } from '@/lib/api/careers';
import { entityMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import type { JobPostingDetail } from '@/types/career';

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const roles = await getCareers();
  return roles.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const role = await getCareer(slug);
  if (!role) return {};

  return entityMetadata({
    title: `${role.title} | Careers`,
    description: `Open role at ${siteConfig.name}${role.location?.city ? ` in ${role.location.city}` : ''}.`,
    path: routes.career(role.slug),
    siteUrl: siteConfig.url,
  });
}

/** `JobPosting` structured data — required on every career listing (§6.3). */
function jobPostingSchema(role: JobPostingDetail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: role.title,
    description: role.description ?? role.title,
    datePosted: role.posted_at,
    validThrough: role.closes_at,
    employmentType: role.employment_type,
    hiringOrganization: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      sameAs: siteConfig.url,
    },
    ...(role.location
      ? {
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: role.location.city,
              addressCountry: role.location.country,
            },
          },
        }
      : {}),
  };
}

export default async function CareerPage({ params }: Params) {
  const { slug } = await params;
  const role = await getCareer(slug);

  if (!role) notFound();

  const place = [role.location?.city, role.location?.country].filter(Boolean).join(', ');

  return (
    <>
      <JsonLd data={jobPostingSchema(role)} />

      <div className="bg-canvas py-4">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: routes.home() },
              { label: 'Careers', href: routes.careers() },
              { label: role.title, href: routes.career(role.slug) },
            ]}
          />
        </Container>
      </div>

      <Section space="md">
        <div className="max-w-3xl">
          <p className="text-eyebrow uppercase text-ink-muted">
            {role.employment_type ?? 'Open role'}
          </p>
          <h1 className="mt-3 text-h1 text-ink">{role.title}</h1>
          {place && <p className="mt-4 text-body-lg text-ink-muted">{place}</p>}

          {role.description && (
            /* CMS-authored HTML from the RBAC-gated admin — see ArticleTemplate. */
            <div
              className="rich-text mt-10"
              dangerouslySetInnerHTML={{ __html: role.description }}
            />
          )}

          <div className="mt-10">
            <JobApplicationForm careerSlug={role.slug} jobTitle={role.title} />
          </div>
        </div>
      </Section>

      <CTABand
        title="Not quite the right role?"
        description="Send us your details and we’ll reach out when something fits."
        cta={{ label: 'Join our talent community', url: routes.contact() }}
      />
    </>
  );
}
