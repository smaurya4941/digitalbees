import Link from 'next/link';
import type { BlogPost } from '@/types/resource';
import { PostCover } from './PostCover';
import { PostMeta } from './PostMeta';

/** Grid card: cover, category, title, excerpt, byline. The whole card is one link. */
export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#C6963A]/50 hover:shadow-lg">
      <div className="aspect-[16/9] overflow-hidden">
        <PostCover
          src={post.cover_image}
          alt={post.cover_image_alt}
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {post.category && (
          <span className="mb-3 inline-flex w-fit rounded-full bg-[#C6963A]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8A5F12]">
            {post.category.name}
          </span>
        )}
        <h3 className="text-lg font-bold leading-snug text-[#0B1F3A] transition-colors group-hover:text-[#8A5F12]">
          <Link href={post.href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>}
        <PostMeta post={post} className="mt-auto pt-5" />
      </div>
    </article>
  );
}
