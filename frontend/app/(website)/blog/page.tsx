import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { ResourceCard } from '@/components/cards/ResourceCard';
import { CTABand } from '@/components/sections/CTABand';
import { getInsights } from '@/lib/api/resources';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Blog & Technical Publications | ${siteConfig.name}`,
  description:
    'Engineering insights, staff augmentation best practices, AI workflow automation breakdowns, and enterprise hiring playbooks.',
  alternates: { canonical: `${siteConfig.url}/blog` },
};

export const BLOG_CATEGORIES = [
  { slug: 'staff-augmentation', name: 'Staff Augmentation', description: 'Talent scaling, ODCs, and dedicated engineering pods.' },
  { slug: 'software-development', name: 'Software Development', description: 'Modern cloud architecture, APIs, and agile engineering.' },
  { slug: 'ai-automation', name: 'AI Automation', description: 'Agentic workflows, LLMs, and enterprise AI delivery.' },
  { slug: 'hiring', name: 'Hiring & Talent', description: 'Tech recruitment benchmarks, interview guides, and retention.' },
  { slug: 'technology', name: 'Technology Stacks', description: 'Deep dives into React, Node, Python, AWS, and Kubernetes.' },
  { slug: 'case-studies', name: 'Case Studies', description: 'Real-world production outcomes from our client engagements.' },
];

export default async function BlogHubPage() {
  const { items } = await getInsights();

  return (
    <>
      <PageHeader title="TeamBees Blog" breadcrumb="Blog" />

      {/* Category Pills Strip */}
      <section className="bg-slate-50 border-b border-[#C4C6CE]/30 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">
            Categories:
          </span>
          <Link
            href="/blog"
            className="rounded-full bg-[#0B1F3A] text-white px-4 py-1 text-xs font-bold shadow-sm"
          >
            All Articles
          </Link>
          {BLOG_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={routes.blogCategory(cat.slug)}
              className="rounded-full bg-white border border-[#C4C6CE]/40 px-3.5 py-1 text-xs font-medium text-[#44474d] hover:border-[#C6963A] hover:text-[#0B1F3A] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <Section space="md">
        <SectionHeading
          eyebrow="ENGINEERING & TALENT INSIGHTS"
          title="Field Notes from Production"
          description="Actionable architecture, team-scaling playbooks, and delivery insights from our global practice leads."
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
