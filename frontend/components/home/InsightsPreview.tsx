import { getInsights } from '@/lib/api/resources';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { TextLink } from '@/components/ui/TextLink';

export default async function InsightsPreview() {
  const { items } = await getInsights(3).catch(() => ({ items: [] }));
  if (items.length === 0) return null;

  return (
    <Section space="lg" tone="canvas">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <SectionHeading title="Latest thinking" as="h2" />
        <TextLink href="/insights" withArrow>
          View all insights
        </TextLink>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((insight) => (
          <ResourceCard key={insight.slug} resource={insight} />
        ))}
      </div>
    </Section>
  );
}
