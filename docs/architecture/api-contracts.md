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
Related entities resolve through `entity_relations`
(`IsContentEntity::related()` / `relatedInbound()`); relation types
`serves` / `built-with` / `delivered-in` / `featured-in`.

---

## Authentication — Laravel Sanctum (SPA, stateful cookie)

The Next.js **admin panel** (`/admin/*`) authenticates against the API with the
Sanctum SPA flow. No tokens touch the browser — the session lives in an
encrypted, HTTP-only cookie. The public website never authenticates.

```
Next.js /admin  ──1── GET  /sanctum/csrf-cookie        → sets XSRF-TOKEN cookie
                ──2── POST /api/v1/login   {email,password}  (X-XSRF-TOKEN header)
                ──3── GET  /api/v1/user    → { id, name, email, role, permissions[] }
                ──4── POST /api/v1/logout
```

- `bootstrap/app.php` → `statefulApi()` (EnsureFrontendRequestsAreStateful).
- `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN`, `SESSION_SAME_SITE` and CORS
  `supports_credentials=true` must all agree for the cookie to round-trip.
- `throttle:auth` — 5 attempts / min / (email+IP).
- `active` middleware logs out and 403s suspended/invited accounts mid-session.

### Endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/sanctum/csrf-cookie` | — | Sanctum, outside `/v1` |
| `POST` | `/api/v1/login` | guest | `{ email, password, remember? }` → profile |
| `GET` | `/api/v1/user` | cookie | current user + `permissions[]` |
| `POST` | `/api/v1/logout` | cookie | invalidates the session |

## Authorization — roles + permissions (`spatie/laravel-permission`)

Two roles; the granularity is in the **permissions**, so tightening what staff
can do is a data change (`RoleSeeder`), never a code change. `admin` bypasses
every check via `Gate::before`.

| Permission | `admin` | `staff` |
|---|:---:|:---:|
| `content.create` / `content.update` / `content.publish` | ✅ | ✅ |
| `media.upload` · `seo.update` · `navigation.update` · `inquiries.view` | ✅ | ✅ |
| `content.delete` · `media.delete` · `inquiries.manage` | ✅ | — |
| `settings.manage` · `users.manage` · `roles.manage` | ✅ | — |

Seeded accounts: `ADMIN_EMAIL` (`admin`); `staff@digitalbees.in` (`staff`, local/testing only).

### Protected write endpoints

Writes sit on the **same URLs** as the public reads — access is decided by
permission, not URL shape (`auth:sanctum` + `active` + `permission:`).

| Method | Path | Permission |
|---|---|---|
| `GET` | `/api/v1/admin/practices` · `/admin/practices/{slug}` | `content.update` \| `content.publish` |
| `POST` | `/api/v1/practices` | `content.create` |
| `PUT`/`PATCH` | `/api/v1/practices/{slug}` | `content.update` (+ `content.publish` to change published state) |
| `DELETE` | `/api/v1/practices/{slug}` | `content.delete` (admin only) |
| `GET` | `/api/v1/admin/content/{type}` | `content.update` \| `content.publish` |
| `PATCH` | `/api/v1/admin/content/{type}/{slug}/status` | `content.publish` |

`{type}` ∈ `practices` · `industries` · `regions` · `technologies` · `case-studies`.
Practices is the reference CRUD; the other taxonomies expose the status endpoint
and gain full CRUD by copying the Practice module.

## Still stubbed (envelope with `meta.stub = true`)

`GET /insights` · `GET /careers` + `/{slug}` · `GET /resources` + `/{slug}` ·
`GET /locations` + `/{slug}` · `GET /pages/resolve?path=` · `GET /search?q=` ·
`GET /sitemap` · `GET /redirects` · `POST /leads` · `POST /newsletter` ·
`POST /careers/{career}/apply` · `POST /chatbot/message`.
