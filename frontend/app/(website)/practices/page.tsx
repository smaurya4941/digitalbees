import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { CTABand } from '@/components/sections/CTABand';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PracticeCard } from '@/components/cards/PracticeCard';
import { getPractices } from '@/lib/api/practices';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Practices',
  description: `The seven TeamBees practices — ${siteConfig.practices.length} integrated ways to bring talent and technology to your business.`,
  alternates: { canonical: `${siteConfig.url}/practices` },
};

// Content changes are pushed via /api/revalidate; refresh hourly as a backstop.
export const revalidate = 3600;

export default async function PracticesHubPage() {
  const practices = await getPractices();

  return (
    <>
      <div className="bg-canvas py-4">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: routes.home() },
              { label: 'Practices', href: routes.practices() },
            ]}
          />
        </Container>
      </div>

      <Section space="md">
        <SectionHeading
          eyebrow="Practices"
          title="Seven practices, one partner"
          description="Each practice is a focused capability. Together they cover the full path from strategy to running system — with shared delivery leadership across all of them."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {practices.map((practice, index) => (
            <PracticeCard key={practice.id} practice={practice} index={index} />
          ))}
        </div>
      </Section>

      <CTABand />
    </>
  );
}
