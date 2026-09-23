import type { BlogPost } from '@/types/resource';
import { cn } from '@/lib/utils/cn';
import { formatPostDate, initials } from './format';

/** Byline: author avatar + name, then date · reading time. */
export function PostMeta({ post, className, inverted = false }: { post: BlogPost; className?: string; inverted?: boolean }) {
  const date = formatPostDate(post.published_at);

  return (
    <div className={cn('flex items-center gap-3 text-sm', inverted ? 'text-white/70' : 'text-ink-muted', className)}>
      {post.author && <AuthorAvatar name={post.author.name} src={post.author.avatar} />}
      <div className="min-w-0">
        {post.author && (
          <div className={cn('truncate font-semibold', inverted ? 'text-white' : 'text-[#0B1F3A]')}>{post.author.name}</div>
        )}
        {(date || post.reading_time_minutes) && (
          <div className="truncate">
            {post.published_at && date ? <time dateTime={post.published_at}>{date}</time> : null}
            {date && post.reading_time_minutes ? <span aria-hidden> · </span> : null}
            {post.reading_time_minutes ? <span>{post.reading_time_minutes} min read</span> : null}
          </div>
        )}
      </div>
    </div>
  );
}

export function AuthorAvatar({ name, src, size = 'sm' }: { name: string; src?: string; size?: 'sm' | 'lg' }) {
  const dim = size === 'lg' ? 'h-14 w-14 text-base' : 'h-9 w-9 text-xs';

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image on an arbitrary host
    return <img src={src} alt="" className={cn(dim, 'shrink-0 rounded-full object-cover')} loading="lazy" />;
  }

  return (
    <span
      aria-hidden
      className={cn(dim, 'flex shrink-0 items-center justify-center rounded-full bg-[#0B1F3A] font-bold text-[#C6963A]')}
    >
      {initials(name)}
    </span>
  );
}
