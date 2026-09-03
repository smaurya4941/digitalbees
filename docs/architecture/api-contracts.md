# API Contracts (v1)

> The JSON contract between the Laravel API (`backend/`) and the Next.js
> frontend. The frontend depends only on these shapes — never on the database.

## Envelope

Every response uses `App\Support\Http\ApiResponse`:

```jsonc
// item
{ "data": { … }, "meta": {} }
// collection
{ "data": [ … ], "meta": { "count": 7 }, "links": [] }
// cursor page
{ "data": [ … ], "meta": { "per_page": 20, "has_more": true },
  "links": { "next": "…", "prev": null } }
```

Frontend: `apiGet<T>()` returns `data`; `apiList<T>()` returns `{ data, meta, links }`.

**Errors** — JSON always (`ForceJsonResponse`): `422` `{ message, errors }` for
validation; `404` `{ message }` for unknown/unpublished slugs; `429` when
throttled. `ApiError.status` drives frontend handling (`404 → notFound()`).

## Conventions

- Slugs are the public identifier. Only `status = published` rows are exposed.
- Every entity carries an `href` (frontend path) so the frontend never rebuilds
  taxonomy URLs server-side.
- Read endpoints are cacheable and tagged; writes are throttled (`throttle:leads`).

---

## Practice

### `GET /api/v1/practices` → `PracticeSummary[]`
```jsonc
{
  "id": 3, "slug": "ai-bees", "name": "AI Bees",
  "tagline": "Applied AI, automation and production agents.",
  "summary": "…", "icon": "sparkles", "color_token": "brand-gold",
  "href": "/practices/ai-bees", "sub_services_count": 4
}
```

### `GET /api/v1/practices/{slug}` → `PracticeDetail`  *(the `practice` template contract)*
```jsonc
{
  "id": 3, "slug": "ai-bees", "name": "AI Bees",
  "template": "practice", "href": "/practices/ai-bees",

  "hero": {
    "eyebrow": "AI & Automation",
    "title": "Applied AI, automation and production agents.",
    "description": "…",
    "cta": { "label": "Start a conversation", "url": "/contact" },
    "secondary_cta": { "label": "Explore all practices", "url": "/practices" }
  },

  "proof_points": [ { "value": 4, "label": "Service lines" }, … ],
  "how_we_work": [ { "step": 1, "title": "Discover", "description": "…" }, … ],

  "services":   [ { "id", "slug", "name", "summary", "href": "/practices/ai-bees/ml-engineering" } ],
  "industries": [ { "id", "slug", "name", "summary", "icon", "href": "/industries/healthcare" } ],
  "technologies":[ { "id", "slug", "name", "summary", "vendor_name", "href": "/technologies/aws" } ],
  "regions":    [ { "id", "slug", "name", "iso_code", "summary", "href": "/regions/usa" } ],
  "case_studies": [],
  "related_practices": [ PracticeSummary, … ],

  "seo": {
    "meta_title": "AI Bees | TeamBees",
    "meta_description": "…",
    "canonical_url": "https://www.teambees.com/practices/ai-bees",
    "robots": "index,follow",
    "og_title": "…", "og_description": "…", "og_image_url": null,
    "twitter_card": "summary_large_image",
    "schema_type": "Service",
    "schema_json": { "@context": "https://schema.org", "@type": "Service", … }
  }
}
```

### `GET /api/v1/practices/{practice}/sub-services/{subService}` → `SubService`
Scoped: the sub-service must belong to `{practice}` or `404`.

### Backend pipeline
`PracticeController` → `PracticeService` → `PracticeRepository`
(`EloquentPracticeRepository`) → models. Related entities resolve through
`entity_relations` (`IsContentEntity::related()`); relation types
`serves` / `built-with` / `delivered-in`. SEO defaults are synthesised by
`App\Support\Seo\SeoPayload` when no `seo_metadata` row exists.

### Cache tags
`practices`, `practice:{slug}`. Publishing a practice dispatches
`NotifyFrontendRevalidate::dispatch(['practices', "practice:{$slug}"])`.

---

## Implemented (Phase 1)

Same envelope, same conventions. Full request/response schemas in
[`docs/api/openapi.yaml`](../api/openapi.yaml).

- `GET /navigation` — CMS menu trees keyed by menu key (`header`, `footer`, `mega-practices`).
- `GET /industries` + `/{slug}` — `industry` template: hero, serving practices,
  technologies, case studies, SEO.
- `GET /regions` + `/{slug}` — `region` template: hero, practices delivered there,
  `locations`, case studies, SEO.
- `GET /technologies` + `/{slug}` — `technology` template: hero, practices,
  industries, case studies, SEO.
- `GET /case-studies` + `/{slug}` — `case-study` template: hero, challenge/solution/
  results, metrics, linked practices/industries/technologies/regions, SEO.
- `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` — Sanctum token auth for
  the CMS/admin surface.
- `GET /admin/{type}` and `PATCH /admin/{type}/{slug}/status` — role-gated
  (`auth:sanctum` + `role:`) draft/published/archived lifecycle for
  practices/industries/regions/technologies/case-studies.

Related entities resolve through `entity_relations`
(`IsContentEntity::related()` / `relatedInbound()`); relation types
`serves` / `built-with` / `delivered-in` / `featured-in`.

### Roles

`Super Admin` · `Admin` · `Editor` (edit only) · `SEO Manager` (SEO fields) ·
`Reviewer` (publish/unpublish). Seeded by `RoleSeeder`; the seeded
`test@example.com` user is `Super Admin`.

## Still stubbed (envelope with `meta.stub = true`)

`GET /insights` · `GET /careers` + `/{slug}` · `GET /resources` + `/{slug}` ·
`GET /locations` + `/{slug}` · `GET /pages/resolve?path=` · `GET /search?q=` ·
`GET /sitemap` · `GET /redirects` · `POST /leads` · `POST /newsletter` ·
`POST /careers/{career}/apply` · `POST /chatbot/message`.
