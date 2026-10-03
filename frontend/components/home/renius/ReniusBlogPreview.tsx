import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { BlogPost } from '@/types/resource';
import { PostCard } from '@/components/blog/PostCard';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils/cn';

// Columns follow the post count so one or two posts never leave an empty track.
const GRID_COLS: Record<number, string> = {
  1: 'md:grid-cols-1 max-w-md',
  2: 'md:grid-cols-2 max-w-4xl',
  3: 'md:grid-cols-2 lg:grid-cols-3',
};

/** Home-page teaser for the blog: the latest posts, rendered with the blog hub's own card. */
export default function ReniusBlogPreview({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="blog-preview-heading" className="py-20 bg-[#F8FAFD] border-b border-[#CBDFF2] relative">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#CBDFF2]">
              <BookOpen className="h-3.5 w-3.5 text-[#9E6D18]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9E6D18]">
                FROM THE BLOG
              </span>
            </div>
            <h2 id="blog-preview-heading" className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1F3A] tracking-tight">
              Latest from the <span className="text-[#9E6D18]">TeamBees blog.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl">
              Articles on engineering, AI, talent and delivery, written by our practice leads.
            </p>
          </div>

          <Link
            href={routes.blog()}
            className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-all shrink-0"
          >
            <span>Visit the Blog</span>
            <ArrowRight className="h-4 w-4 text-[#D8A74A] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className={cn('grid grid-cols-1 gap-6', GRID_COLS[Math.min(posts.length, 3)])}>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
