import { Card, CardBody, CardDescription, CardEyebrow, CardTitle } from '@/components/ui/Card';
import type { CaseStudySummary } from '@/types/case-study';

type CaseStudyCardProps = {
  caseStudy: CaseStudySummary;
};

/**
 * Case-study card (blueprint §17.3): client tag, headline result, summary.
 * Case studies carry `title`/`client_name` rather than the `name`/`summary`
 * shape of {@link ContentCard}, and lead with a quantified metric — which is
 * the whole point of the card (§10.1, "quantified outcomes").
 */
export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const [headline] = caseStudy.metrics ?? [];

  return (
    <Card href={caseStudy.href} ariaLabel={caseStudy.title} interactive>
      <CardBody>
        <CardEyebrow>{caseStudy.client_name ?? 'Case study'}</CardEyebrow>

        {headline && (
          <p className="text-h2 text-brand-navy">
            {headline.value}{' '}
            <span className="text-body-sm text-ink-muted">{headline.label}</span>
          </p>
        )}

        <CardTitle>{caseStudy.title}</CardTitle>
        {caseStudy.summary && <CardDescription>{caseStudy.summary}</CardDescription>}
      </CardBody>
    </Card>
  );
}
