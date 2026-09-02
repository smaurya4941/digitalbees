import { Card, CardBody, CardDescription, CardEyebrow, CardTitle } from '@/components/ui/Card';
import type { EntitySummary } from '@/types/content';

type ContentCardProps = {
  item: EntitySummary;
  eyebrow?: string;
};

/** Generic summary card for related industries / technologies / regions. */
export function ContentCard({ item, eyebrow }: ContentCardProps) {
  return (
    <Card href={item.href} ariaLabel={item.name} interactive>
      <CardBody>
        {eyebrow && <CardEyebrow>{eyebrow}</CardEyebrow>}
        <CardTitle>{item.name}</CardTitle>
        {item.summary && <CardDescription>{item.summary}</CardDescription>}
      </CardBody>
    </Card>
  );
}
