import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { EmptyState } from '@/components/ui/EmptyState';
import { TextLink } from '@/components/ui/TextLink';
import { search } from '@/lib/api/search';
import type { SearchHit, SearchResultType } from '@/types/search';

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true }, // noindex — IA doc §7
};

const TYPE_LABELS: Record<SearchResultType, string> = {
  practice: 'Practices',
  industry: 'Industries',
  region: 'Regions',
  technology: 'Technologies',
  case_study: 'Case studies',
  insight: 'Insights',
  resource: 'Resources',
  career: 'Careers',
};

function groupByType(hits: SearchHit[]): Array<[SearchResultType, SearchHit[]]> {
  const groups = new Map<SearchResultType, SearchHit[]>();
  for (const hit of hits) {
    const group = groups.get(hit.type) ?? [];
    group.push(hit);
    groups.set(hit.type, group);
  }
  return Array.from(groups.entries());
}

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

/** `/search` — blueprint §30.1: full results page for a query passed in `?q=`. */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  const hits = q ? await search(q) : [];
  const groups = groupByType(hits);

  return (
    <Section space="lg">
      <Container>
        <SectionHeading
          eyebrow="Search"
          title={q ? `Results for “${q}”` : 'Search TeamBees'}
          description={q ? `${hits.length} result${hits.length === 1 ? '' : 's'}` : 'Search practices, industries, case studies, insights, and more.'}
        />

        {q && groups.length === 0 && (
          <EmptyState
            className="mt-12"
            title="We couldn't find a match for that"
            description="Try a different term, or contact us and we'll point you in the right direction."
            action={{ label: 'Contact us', href: '/contact-us' }}
          />
        )}

        <div className="mt-12 flex flex-col gap-10">
          {groups.map(([type, typeHits]) => (
            <div key={type}>
              <h2 className="text-eyebrow uppercase text-ink-muted">{TYPE_LABELS[type]}</h2>
              <ul className="mt-4 flex flex-col divide-y divide-hairline">
                {typeHits.map((hit) => (
                  <li key={`${hit.type}-${hit.url}`} className="py-4">
                    <TextLink href={hit.url} withArrow>
                      <span className="text-h4 text-ink">{hit.title}</span>
                    </TextLink>
                    {hit.excerpt && <p className="mt-1 text-body-sm text-ink-muted">{hit.excerpt}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
