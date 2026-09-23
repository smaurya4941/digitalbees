import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PostCover } from '@/components/blog/PostCover';
import { AuthorAvatar } from '@/components/blog/PostMeta';
import { PostCard } from '@/components/blog/PostCard';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { formatPostDate } from '@/components/blog/format';
import { CTABand } from '@/components/sections/CTABand';
import { SeoJsonLd } from '@/components/seo/JsonLd';
import { getBlogCategories, getBlogPost, getBlogPosts } from '@/lib/api/blog';
import { toMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import '@/components/blog/blog-prose.css';

type Params = { params: Promise<{ slug: string }> };

// Backstop revalidation; saves in the admin purge the `insights` tag immediately.
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const { items } = await getBlogPosts({ perPage: 48 });
  return items.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  if (post.seo) {
    const metadata = toMetadata(post.seo);
    return {
      ...metadata,
      openGraph: {
        ...metadata.openGraph,
        type: 'article',
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        ...(post.cover_image && !post.seo.og_image_url ? { images: [{ url: post.cover_image, alt: post.cover_image_alt ?? '' }] } : {}),
      },
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${siteConfig.url}${routes.blogPost(post.slug)}` },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    // Category pages used to live at /blog/{category}; keep those links working.
    const category = (await getBlogCategories()).find((c) => c.slug === slug);
    if (category) permanentRedirect(routes.blogCategory(category.slug));
    notFound();
  }

  const url = `${siteConfig.url}${routes.blogPost(post.slug)}`;
  const date = formatPostDate(post.published_at);
  const updated = formatPostDate(post.updated_at);
  const toc = post.toc ?? [];
  const related = post.related ?? [];

  return (
    <>
      {post.seo && <SeoJsonLd seo={post.seo} />}

      <article>
        {/* Header */}
        <header className="bg-[#0B1F3A] pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-4xl px-margin-mobile md:px-8">
            <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs text-white/60">
              <Link href={routes.home()} className="hover:text-[#C6963A]">
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link href={routes.blog()} className="hover:text-[#C6963A]">
                Blog
              </Link>
              {post.category && (
                <>
                  <span aria-hidden>/</span>
                  <Link href={routes.blogCategory(post.category.slug)} className="hover:text-[#C6963A]">
                    {post.category.name}
                  </Link>
                </>
              )}
            </nav>

            {post.category && (
              <Link
                href={routes.blogCategory(post.category.slug)}
                className="mb-5 inline-flex rounded-full bg-[#C6963A]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#E2B868] hover:bg-[#C6963A]/25"
              >
                {post.category.name}
              </Link>
            )}

            <h1 className="text-[32px] font-extrabold leading-[1.15] tracking-tight text-white md:text-[48px]">
              {post.title}
            </h1>
            {post.excerpt && <p className="mt-5 text-lg leading-relaxed text-white/70 md:text-xl">{post.excerpt}</p>}

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
              {post.author && (
                <div className="flex items-center gap-3">
                  <AuthorAvatar name={post.author.name} src={post.author.avatar} />
                  <div>
                    <div className="font-semibold text-white">{post.author.name}</div>
                    {post.author.role && <div className="text-xs">{post.author.role}</div>}
                  </div>
                </div>
              )}
              {date && post.published_at && <time dateTime={post.published_at}>{date}</time>}
              {post.reading_time_minutes && <span>{post.reading_time_minutes} min read</span>}
            </div>
          </div>
        </header>

        {/* Cover overlaps the header for a magazine-style lead image */}
        {post.cover_image && (
          <div className="mx-auto -mt-10 max-w-5xl px-margin-mobile md:-mt-14 md:px-8">
            <figure className="aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <PostCover src={post.cover_image} alt={post.cover_image_alt} eager />
            </figure>
          </div>
        )}

        {/* Body + sidebar */}
        <div className="mx-auto max-w-container-max px-margin-mobile py-12 md:px-margin-desktop md:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
            <div className="mx-auto w-full max-w-3xl min-w-0">
              {post.body ? (
                // Sanitised server-side by BlogContentRenderer (allowlist of tags/attributes/URL schemes).
                <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.body }} />
              ) : (
                <p className="text-ink-muted">This article has no content yet.</p>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-neutral-200 pt-8">
                  <span className="mr-1 text-xs font-bold uppercase tracking-wider text-ink-subtle">Tags</span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={routes.blogTag(tag)}
                      rel="nofollow"
                      className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm font-medium text-ink-muted hover:border-[#C6963A]/60 hover:text-[#0B1F3A]"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-8">
                <ShareButtons url={url} title={post.title} />
                {updated && updated !== date && post.updated_at && (
                  <p className="text-xs text-ink-subtle">
                    Updated <time dateTime={post.updated_at}>{updated}</time>
                  </p>
                )}
              </div>

              {post.author && (
                <aside className="mt-10 flex gap-4 rounded-2xl border border-neutral-200 bg-[#F8F9FF] p-6">
                  <AuthorAvatar name={post.author.name} src={post.author.avatar} size="lg" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-subtle">Written by</p>
                    <p className="mt-1 text-lg font-bold text-[#0B1F3A]">{post.author.name}</p>
                    {post.author.role && <p className="text-sm text-ink-muted">{post.author.role}</p>}
                  </div>
                </aside>
              )}

              <Link
                href={routes.blog()}
                className="mt-10 inline-flex items-center gap-1.5 text-sm font-bold text-[#8A5F12] hover:underline"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back to all posts
              </Link>
            </div>

            {toc.length > 1 && (
              <aside className="hidden lg:block">
                <div className="sticky top-[128px]">
                  <TableOfContents entries={toc} />
                </div>
              </aside>
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-neutral-200 bg-[#F8F9FF] py-14 md:py-20" aria-labelledby="related-heading">
          <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 id="related-heading" className="text-2xl font-bold tracking-tight text-[#0B1F3A] md:text-3xl">
                Keep reading
              </h2>
              <Link href={routes.blog()} className="text-sm font-bold text-[#8A5F12] hover:underline">
                All posts →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABand />
    </>
  );
}
