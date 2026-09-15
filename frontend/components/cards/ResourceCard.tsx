import { Card, CardBody, CardDescription, CardEyebrow, CardTitle } from '@/components/ui/Card';
import type { ResourceSummary } from '@/types/resource';

type ResourceCardProps = {
  resource: ResourceSummary;
};

const TYPE_LABEL: Record<string, string> = {
  blog: 'Insight',
  guide: 'Guide',
  webinar: 'Webinar',
  research: 'Research',
  news: 'News',
};

/** Blog/insight card (blueprint §17.3): category tag, title, excerpt, read time. */
export function ResourceCard({ resource }: ResourceCardProps) {
  const meta = [
    resource.published_at
      ? new Date(resource.published_at).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : null,
    resource.reading_time_minutes ? `${resource.reading_time_minutes} min read` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Card href={resource.href} ariaLabel={resource.title} interactive>
      <CardBody>
        <CardEyebrow>{TYPE_LABEL[resource.resource_type] ?? 'Insight'}</CardEyebrow>
        <CardTitle>{resource.title}</CardTitle>
        {resource.excerpt && <CardDescription>{resource.excerpt}</CardDescription>}
        {meta && <p className="text-body-sm text-ink-subtle">{meta}</p>}
      </CardBody>
    </Card>
  );
}
