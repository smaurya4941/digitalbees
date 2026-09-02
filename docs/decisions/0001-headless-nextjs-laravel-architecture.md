# ADR 0001 — Headless architecture: Next.js frontend + Laravel JSON API

- **Status:** Accepted
- **Date:** 2026-09-02
- **Supersedes:** the "Laravel + Blade monolith" description in
  `docs/PRODUCT.md` and `docs/ROADMAP.md` (written during Phase 0, before this
  decision).

## Context

The original blueprint assumed a single Laravel application rendering Blade
templates with TailwindCSS. During Phase 5/6 planning the team chose to split
the system:

- **`backend/`** — Laravel 12, no public HTML. Exposes a versioned JSON API at
  `/api/v1`, acts as the CMS / content platform, owns the database, queues,
  CRM integration and search indexing.
- **`frontend/`** — Next.js 16 (App Router, React 19, Tailwind v4). Server-renders
  and statically generates every public page, consuming the API during
  SSR/ISR and revalidating on content change.

## Rationale

1. **Core Web Vitals** — Next static/ISR output + edge caching hits the LCP/INP/CLS
   budget more reliably than server-rendered Blade under load.
2. **Editorial velocity** — content changes trigger on-demand revalidation
   (`NotifyFrontendRevalidate` → `POST /api/revalidate`) without a deploy.
3. **Separation of concerns** — the API contract (`{ data, meta, links }`
   envelope) is stable and independently testable; the frontend can evolve its
   rendering without backend changes.
4. **Talent** — React is a larger hiring pool for the marketing-site layer.

## Consequences

- Two deployables, two toolchains (`composer` + `pnpm`), two test suites.
- "Blade template / component" everywhere in the roadmap now means a **Next.js
  template/component** under `frontend/features/*` and `frontend/components/*`.
- `page_templates.blade_view` keeps its column name but stores a **frontend
  template key** (e.g. `PracticeTemplate`).
- SEO (`seo_metadata`), sitemap and redirects are produced by the API and
  consumed by the frontend's `generateMetadata()` / route handlers / middleware.
- Auth for any future admin UI is Sanctum token / SPA session — not Blade
  sessions.

## Not changing

The database schema (`docs/data-model/schema.sql`), the taxonomy, the content
model and the URL rules are unaffected — they were always storage/structure
decisions, independent of the rendering layer.
