import Link from 'next/link';
import type { BlogCategory } from '@/types/resource';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils/cn';

/**
 * Horizontal category filter. Scrolls sideways on small screens; categories
 * without published posts are hidden so readers never land on an empty page.
 */
export function CategoryTabs({ categories, active }: { categories: BlogCategory[]; active?: string }) {
  const visible = categories.filter((c) => (c.post_count ?? 0) > 0 || c.slug === active);
  if (visible.length === 0) return null;

  const tab = (isActive: boolean) =>
    cn(
      'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
      isActive
        ? 'bg-[#0B1F3A] text-white shadow-sm'
        : 'border border-neutral-200 bg-white text-ink-muted hover:border-[#C6963A]/60 hover:text-[#0B1F3A]',
    );

  return (
    <nav aria-label="Blog categories" className="border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-container-max gap-2 overflow-x-auto px-margin-mobile py-4 [scrollbar-width:none] md:px-margin-desktop">
        <Link href={routes.blog()} className={tab(!active)} aria-current={!active ? 'page' : undefined}>
          All posts
        </Link>
        {visible.map((category) => (
          <Link
            key={category.slug}
            href={routes.blogCategory(category.slug)}
            className={tab(active === category.slug)}
            aria-current={active === category.slug ? 'page' : undefined}
          >
            {category.name}
            {typeof category.post_count === 'number' && (
              <span className="ml-1.5 text-xs opacity-60">{category.post_count}</span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
