import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/types/resource';
import { PostCover } from './PostCover';
import { PostMeta } from './PostMeta';

/** Large lead story shown above the grid on the unfiltered first page. */
export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <article className="group relative grid overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-sm transition-shadow hover:shadow-xl lg:grid-cols-2">
      <div className="aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-[380px]">
        <PostCover
          src={post.cover_image}
          alt={post.cover_image_alt}
          eager
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-10">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#0B1F3A] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#C6963A]">
            Featured
          </span>
          {post.category && (
            <span className="rounded-full bg-[#C6963A]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8A5F12]">
              {post.category.name}
            </span>
          )}
        </div>
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-[#0B1F3A] sm:text-3xl">
          <Link href={post.href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {post.title}
          </Link>
        </h2>
        {post.excerpt && <p className="mt-4 text-base leading-relaxed text-ink-muted">{post.excerpt}</p>}
        <PostMeta post={post} className="mt-6" />
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#8A5F12]">
          Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </article>
  );
}
