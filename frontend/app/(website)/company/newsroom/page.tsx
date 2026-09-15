import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { EmptyState } from '@/components/ui/EmptyState';
import { resolvePage } from '@/lib/api/pages';
import { toMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';

export const revalidate = 3600;

type HeroSection = { eyebrow?: string; title?: string; description?: string };

export async function generateMetadata(): Promise<Metadata> {
  const page = await resolvePage(routes.companyNewsroom());
  if (!page) return {};
  return toMetadata(page.seo);
}

export default async function NewsroomPage() {
  const page = await resolvePage(routes.companyNewsroom());

  if (!page) notFound();

  const hero = (page.sections.hero ?? {}) as HeroSection;

  return (
    <Section space="lg">
      <Container width="narrow">
        <SectionHeading eyebrow={hero.eyebrow ?? 'Newsroom'} title={hero.title ?? 'News and announcements'} />
        {hero.description && <p className="mt-6 text-body-lg text-ink-muted">{hero.description}</p>}

        <EmptyState
          className="mt-12"
          title="No press releases yet"
          description="Check back here for TeamBees news, media mentions, and award announcements."
          action={{ label: 'Contact our team', href: routes.contact() }}
        />
      </Container>
    </Section>
  );
}
