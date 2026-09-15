import { Section } from '@/components/ui/Section';
import { getCaseStudies } from '@/lib/api/case-studies';
import { Card, CardBody, CardEyebrow, CardTitle } from '@/components/ui/Card';
import { TextLink } from '@/components/ui/TextLink';

export default async function FeaturedCaseStudy() {
  const caseStudies = await getCaseStudies().catch(() => []);
  if (caseStudies.length === 0) return null;

  const featured = caseStudies[0];
  const [headline] = featured.metrics ?? [];

  return (
    <Section tone="sunken" space="lg">
      <Card href={featured.href} interactive>
        <CardBody className="p-8 md:p-12">
          <CardEyebrow>{featured.client_name ?? 'Featured Case Study'}</CardEyebrow>
          
          {headline && (
            <p className="mt-4 text-[42px] leading-tight font-bold text-brand-navy md:text-[64px]">
              {headline.value}{' '}
              <span className="text-body-lg font-normal text-ink-muted block mt-2">{headline.label}</span>
            </p>
          )}

          <CardTitle className="mt-6 text-h3 md:text-h2">{featured.title}</CardTitle>
          {featured.summary && (
            <p className="mt-4 text-body-md md:text-body-lg max-w-4xl text-ink-muted">
              {featured.summary}
            </p>
          )}
          
          <div className="mt-8">
            <TextLink href={featured.href} withArrow>
              Read the full story
            </TextLink>
          </div>
        </CardBody>
      </Card>
    </Section>
  );
}
