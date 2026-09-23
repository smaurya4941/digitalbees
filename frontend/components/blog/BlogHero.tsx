import Link from 'next/link';
import { Search } from 'lucide-react';
import { routes } from '@/config/routes';

/**
 * Blog page header: breadcrumb, admin-editable title + intro, and a search
 * box. The search is a plain GET form, so it works without JavaScript and
 * the results page is shareable.
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
    <section className="relative overflow-hidden bg-[#0B1F3A] pt-28 pb-14 md:pt-36 md:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{ backgroundImage: 'radial-gradient(rgba(198,150,58,0.25) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />
      <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/60">
          <Link href={routes.home()} className="hover:text-[#C6963A]">
            Home
          </Link>
          <span aria-hidden>/</span>
          {crumbs.length === 0 ? (
            <span className="font-semibold text-[#C6963A]" aria-current="page">
              Blog
            </span>
          ) : (
            <>
              <Link href={routes.blog()} className="hover:text-[#C6963A]">
                Blog
              </Link>
              {crumbs.map((crumb, i) => (
                <span key={crumb.label} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  {crumb.href && i < crumbs.length - 1 ? (
                    <Link href={crumb.href} className="hover:text-[#C6963A]">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-[#C6963A]" aria-current="page">
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </>
          )}
        </nav>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            {eyebrow && (
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#C6963A]">{eyebrow}</p>
            )}
            <h1 className="text-[36px] font-extrabold leading-tight tracking-tight text-white md:text-[52px]">{title}</h1>
            {description && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">{description}</p>}
          </div>

          <form action={searchAction} method="get" role="search" className="lg:col-span-5">
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-1.5 backdrop-blur focus-within:border-[#C6963A]/60">
              <Search className="ml-3 h-4 w-4 shrink-0 text-[#C6963A]" aria-hidden />
              <input
                id="blog-search"
                name="q"
                type="search"
                defaultValue={query}
                maxLength={100}
                placeholder="Search articles…"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#C6963A] px-4 py-2.5 text-sm font-bold text-[#0B1F3A] transition-opacity hover:opacity-90"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
