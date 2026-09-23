import type { Metadata } from 'next';
import { BlogHero } from '@/components/blog/BlogHero';
import { CategoryTabs } from '@/components/blog/CategoryTabs';
import { BlogListing } from '@/components/blog/BlogListing';
import { postsPerPage, readListingParams, type ListingSearchParams } from '@/components/blog/params';
import { CTABand } from '@/components/sections/CTABand';
import { getBlogCategories, getBlogPosts } from '@/lib/api/blog';
import { getSettings } from '@/lib/api/settings';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

const DEFAULT_TITLE = 'All Blogs';
const DEFAULT_DESCRIPTION = 'Field notes on engineering, AI, talent and delivery from our practice leads.';

type Props = { searchParams: ListingSearchParams };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const [settings, { q, tag, page }] = await Promise.all([
    getSettings().catch(() => ({}) as Awaited<ReturnType<typeof getSettings>>),
    searchParams.then(readListingParams),
  ]);
  const title = settings['blog.title'] || DEFAULT_TITLE;

  return {
    title: page > 1 ? `${title} — Page ${page}` : title,
    description: settings['blog.description'] || DEFAULT_DESCRIPTION,
    alternates: { canonical: `${siteConfig.url}${routes.blog()}` },
    // Search/tag result pages are thin duplicates of the hub — keep them out of the index.
    robots: q || tag ? { index: false, follow: true } : undefined,
  };
}

export default async function BlogHubPage({ searchParams }: Props) {
  const { q, tag, page } = readListingParams(await searchParams);
  const settings = await getSettings().catch(() => ({}) as Awaited<ReturnType<typeof getSettings>>);
  const perPage = postsPerPage(settings['blog.posts_per_page']);
  const showFeatured = !q && !tag && page === 1;

  const [result, categories, featured] = await Promise.all([
    getBlogPosts({ q, tag, page, perPage }),
    getBlogCategories(),
    showFeatured ? getBlogPosts({ featured: true, perPage: 1 }) : Promise.resolve(null),
  ]);

  // Fall back to the newest post as the lead story when none is flagged featured.
  const lead = showFeatured ? (featured?.items[0] ?? result.items[0] ?? null) : null;

  return (
    <>
      <BlogHero
        title={settings['blog.title'] || DEFAULT_TITLE}
        description={settings['blog.description'] || DEFAULT_DESCRIPTION}
        query={q}
      />
      <CategoryTabs categories={categories} />
      <BlogListing result={result} featured={lead} basePath={routes.blog()} query={q} tag={tag} />
      <CTABand />
    </>
  );
}
