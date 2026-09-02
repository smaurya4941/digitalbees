import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PracticeTemplate } from '@/templates/PracticeTemplate';
import { getPractice, getPractices } from '@/lib/api/practices';
import { toMetadata } from '@/lib/seo/metadata';

type Params = { params: Promise<{ practice: string }> };

// Backstop revalidation; on-demand invalidation comes from /api/revalidate.
export const revalidate = 3600;
// Render known practices at build; unknown slugs 404 (no thin doorway pages).
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ practice: string }>> {
  const practices = await getPractices();
  return practices.map((p) => ({ practice: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { practice: slug } = await params;
  const practice = await getPractice(slug);
  if (!practice) return {};
  return toMetadata(practice.seo);
}

export default async function PracticePage({ params }: Params) {
  const { practice: slug } = await params;
  const practice = await getPractice(slug);

  if (!practice) notFound();

  return <PracticeTemplate practice={practice} />;
}
