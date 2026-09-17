import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StitchPracticeTemplate } from "@/templates/StitchPracticeTemplate";
import { getPractice, getPractices } from "@/lib/api/practices";
import { toMetadata } from "@/lib/seo/metadata";

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

/**
 * All 7 practices route through StitchPracticeTemplate — the unified
 * TeamBees Navy/Gold practice hub design. No slug-based branching.
 */
export default async function PracticePage({ params }: Params) {
  const { practice: slug } = await params;
  const practice = await getPractice(slug);

  if (!practice) notFound();

  return <StitchPracticeTemplate practice={practice} />;
}