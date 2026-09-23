import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogHero } from '@/components/blog/BlogHero';
import { CategoryTabs } from '@/components/blog/CategoryTabs';
import { BlogListing } from '@/components/blog/BlogListing';
import { postsPerPage, readListingParams, type ListingSearchParams } from '@/components/blog/params';
import { CTABand } from '@/components/sections/CTABand';
import { getBlogCategories, getBlogPosts } from '@/lib/api/blog';
import { getSettings } from '@/lib/api/settings';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

type Props = {
  params: Promise<{ category: string }>;
  searchParams: ListingSearchParams;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = (await getBlogCategories()).find((c) => c.slug === slug);
  if (!category) return {};

  return {
    title: `${category.name} — Blog`,
    description: category.description ?? `Articles about ${category.name} from the TeamBees blog.`,
    alternates: { canonical: `${siteConfig.url}${routes.blogCategory(category.slug)}` },
  };
}

export default async function BlogCategoryPage({ params, searchParams }: Props) {
  const [{ category: slug }, raw] = await Promise.all([params, searchParams]);
  const { q, tag, page } = readListingParams(raw);

  const categories = await getBlogCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const settings = await getSettings().catch(() => ({}) as Awaited<ReturnType<typeof getSettings>>);
  const result = await getBlogPosts({
    category: category.slug,
    q,
    tag,
    page,
    perPage: postsPerPage(settings['blog.posts_per_page']),
  });

  const basePath = routes.blogCategory(category.slug);

  return (
    <>
      <BlogHero
        eyebrow="Category"
        title={category.name}
        description={category.description}
        query={q}
        searchAction={basePath}
        crumbs={[{ label: category.name }]}
      />
      <CategoryTabs categories={categories} active={category.slug} />
      <BlogListing result={result} basePath={basePath} query={q} tag={tag} />
      <CTABand />
    </>
  );
}
