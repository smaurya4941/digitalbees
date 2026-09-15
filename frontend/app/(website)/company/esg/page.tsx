import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { CTABand } from '@/components/sections/CTABand';
import { resolvePage } from '@/lib/api/pages';
import { toMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';

export const revalidate = 3600;

type HeroSection = { eyebrow?: string; title?: string; description?: string };

export async function generateMetadata(): Promise<Metadata> {
  const page = await resolvePage(routes.companyEsg());
  if (!page) return {};
  return toMetadata(page.seo);
}

export default async function EsgPage() {
  const page = await resolvePage(routes.companyEsg());

  if (!page) notFound();

  const hero = (page.sections.hero ?? {}) as HeroSection;

  return (
    <>
      <Section space="lg">
        <Container width="narrow">
          <SectionHeading eyebrow={hero.eyebrow ?? 'ESG & Community'} title={hero.title ?? 'Our commitments'} />
          {hero.description && <p className="mt-6 text-body-lg text-ink-muted">{hero.description}</p>}
        </Container>
      </Section>

      <CTABand
        title="Have a question about our ESG program?"
        description="Get in touch and we'll connect you with the right team."
        cta={{ label: 'Contact us', url: routes.contact() }}
      />
    </>
  );
}
