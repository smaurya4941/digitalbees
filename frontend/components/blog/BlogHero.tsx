import Link from 'next/link';
import { Search } from 'lucide-react';
import { routes } from '@/config/routes';

/**
 * Blog page header in the site's PageHeader style (light rounded panel, grid
 * overlay, centred title + breadcrumb), plus the admin-editable intro and a
 * search box. The search is a plain GET form, so it works without JavaScript
 * and the results page is shareable.
 */
export function BlogHero({
  title,
  description,
  eyebrow,
  query,
  searchAction = routes.blog(),
  crumbs = [],
}: {
  title: string;
  description?: string | null;
  eyebrow?: string;
  query?: string;
  searchAction?: string;
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <div className="p-2 md:p-4">
      <section className="relative z-0 w-full overflow-hidden rounded-[2.5rem] border border-black/5 bg-[#F4F0EB] pt-[112px] pb-8 shadow-sm md:rounded-[3.5rem] md:pt-[124px] md:pb-10">
        {/* Grid pattern overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Yellow dots decoration */}
        <div aria-hidden className="absolute left-[10%] top-[40%] hidden opacity-80 md:block">
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
            {[
              [6, 34], [16, 34], [11, 26], [21, 26], [26, 18], [31, 26],
              [36, 18], [41, 10], [46, 18], [51, 10], [56, 2],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" fill="#FACC15" />
            ))}
          </svg>
        </div>

        <div className="relative z-10 mx-auto flex max-w-container-max flex-col items-center px-margin-mobile text-center md:px-margin-desktop">
          {eyebrow && (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#C6963A]">{eyebrow}</p>
          )}
          <h1 className="mb-3 text-[32px] font-bold tracking-tight text-ink md:text-[48px]">{title}</h1>

          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-center gap-2 text-[14px] font-semibold tracking-wide">
            <Link href={routes.home()} className="text-[#FACC15] hover:underline">
              Home
            </Link>
            <span aria-hidden className="text-[10px] text-ink-muted">»</span>
            {crumbs.length === 0 ? (
              <span className="text-ink/70" aria-current="page">
                Blog
              </span>
            ) : (
              <>
                <Link href={routes.blog()} className="text-[#FACC15] hover:underline">
                  Blog
                </Link>
                {crumbs.map((crumb, i) => (
                  <span key={crumb.label} className="flex items-center gap-2">
                    <span aria-hidden className="text-[10px] text-ink-muted">»</span>
                    {crumb.href && i < crumbs.length - 1 ? (
                      <Link href={crumb.href} className="text-[#FACC15] hover:underline">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-ink/70" aria-current="page">
                        {crumb.label}
                      </span>
                    )}
                  </span>
                ))}
              </>
            )}
          </nav>

          {description && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">{description}</p>}

          <form action={searchAction} method="get" role="search" className="mt-5 w-full max-w-lg">
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white p-1.5 shadow-sm focus-within:border-[#C6963A] focus-within:ring-2 focus-within:ring-[#C6963A]/25">
              <Search className="ml-3 h-4 w-4 shrink-0 text-[#C6963A]" aria-hidden />
              <input
                id="blog-search"
                name="q"
                type="search"
                defaultValue={query}
                maxLength={100}
                placeholder="Search articles…"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink placeholder:text-ink-subtle focus:!outline-none focus-visible:!outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#C6963A] px-4 py-2 text-sm font-bold text-[#0B1F3A] transition-opacity hover:opacity-90"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
