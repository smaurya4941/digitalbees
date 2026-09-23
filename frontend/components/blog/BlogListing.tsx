import Link from 'next/link';
import { X } from 'lucide-react';
import type { BlogPost } from '@/types/resource';
import type { BlogPostPage } from '@/lib/api/blog';
import { FeaturedPost } from './FeaturedPost';
import { PostCard } from './PostCard';
import { Pagination } from './Pagination';

/**
 * The post grid shared by /blog and /blog/category/[slug]: optional lead
 * story, active-filter summary, cards, pagination and an empty state.
 */
export function BlogListing({
  result,
  featured,
  basePath,
  query,
  tag,
}: {
  result: BlogPostPage;
  featured?: BlogPost | null;
  basePath: string;
  query?: string;
  tag?: string;
}) {
  const posts = featured ? result.items.filter((p) => p.slug !== featured.slug) : result.items;
  const filtered = Boolean(query || tag);

  return (
    <section className="bg-[#F8F9FF] py-12 md:py-16">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        {featured && (
          <div className="mb-12">
            <FeaturedPost post={featured} />
          </div>
        )}

        {filtered && (
          <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-ink-muted" aria-live="polite">
            <span>
              {result.total} {result.total === 1 ? 'result' : 'results'}
              {query && (
                <>
                  {' '}for <strong className="text-[#0B1F3A]">“{query}”</strong>
                </>
              )}
              {tag && (
                <>
                  {' '}tagged <strong className="text-[#0B1F3A]">#{tag}</strong>
                </>
              )}
            </span>
            <Link
              href={basePath}
              className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 font-medium hover:border-[#C6963A]/60"
            >
              <X className="h-3.5 w-3.5" aria-hidden /> Clear
            </Link>
          </div>
        )}

        {posts.length > 0 ? (
          <>
            {!featured && !filtered && <h2 className="sr-only">Latest posts</h2>}
            {featured && (
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#0B1F3A]">Latest posts</h2>
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </>
        ) : (
          !featured && (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
              <h2 className="text-lg font-bold text-[#0B1F3A]">
                {filtered ? 'No posts match your search' : 'No posts here yet'}
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                {filtered ? 'Try a different keyword or browse all posts.' : 'New articles are on their way — check back soon.'}
              </p>
              {filtered && (
                <Link href={basePath} className="mt-5 inline-block text-sm font-bold text-[#8A5F12] hover:underline">
                  View all posts
                </Link>
              )}
            </div>
          )
        )}

        <Pagination
          basePath={basePath}
          page={result.page}
          lastPage={result.lastPage}
          params={{ q: query, tag }}
        />
      </div>
    </section>
  );
}
