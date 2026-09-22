import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { CTABand } from '@/components/sections/CTABand';
import { getInsights } from '@/lib/api/resources';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { BLOG_CATEGORIES } from '../page';

type Params = { params: Promise<{ category: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ category: string }>> {
  return BLOG_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category: slug } = await params;
  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};

  return {
    title: `${category.name} Articles & Guides | ${siteConfig.name}`,
    description: category.description,
    alternates: { canonical: `${siteConfig.url}/blog/${category.slug}` },
  };
}

export default async function BlogCategoryPage({ params }: Params) {
  const { category: slug } = await params;
  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);

  if (!category) notFound();

  const { items } = await getInsights();

  return (
    <>
      <PageHeader title={category.name} breadcrumb={`Blog › ${category.name}`} />

      {/* Category Filter Strip */}
      <section className="bg-slate-50 border-b border-[#C4C6CE]/30 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">
            Categories:
          </span>
          <Link
            href="/blog"
            className="rounded-full bg-white border border-[#C4C6CE]/40 px-3.5 py-1 text-xs font-medium text-[#44474d] hover:border-[#C6963A] hover:text-[#0B1F3A] transition-colors"
          >
            All Articles
          </Link>
          {BLOG_CATEGORIES.map((cat) => {
            const isCurrent = cat.slug === slug;
            return (
              <Link
                key={cat.slug}
                href={routes.blogCategory(cat.slug)}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'bg-[#0B1F3A] text-white shadow-sm font-bold'
                    : 'bg-white border border-[#C4C6CE]/40 text-[#44474d] hover:border-[#C6963A] hover:text-[#0B1F3A]'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </section>

      <Section space="md">
        <SectionHeading
          eyebrow={`${category.name.toUpperCase()} HUB`}
          title={`${category.name} Insights & Playbooks`}
          description={category.description}
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((insight) => (
            <ResourceCard key={insight.slug} resource={insight} />
          ))}
        </div>
      </Section>

      <CTABand />
    </>
  );
}
