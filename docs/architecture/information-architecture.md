# TeamBees — Information Architecture Specification

> Phase 1 deliverable. Answers *what the site contains and how it is organised* —
> not how pages look (Phase 2+). This document is the source of truth for the
> taxonomy seeders, the `page_templates` / `navigation_*` tables, and the
> Next.js route tree.

- **Stack reality:** headless. Laravel exposes JSON under `/api/v1`; the public
  site is the Next.js app in `frontend/`. "Blade template" in the original
  roadmap == a Next.js template component here.
- **Status:** approved baseline. Changes go through an ADR in `docs/decisions/`.

---

## 1. Sitemap (Level 1)

```
TeamBees
├── Home                         /
├── Practices                    /practices
│   └── {practice}               /practices/{practice}
│       └── {sub-service}        /practices/{practice}/{sub-service}
├── Industries                   /industries
│   └── {industry}               /industries/{industry}
│       └── {practice}           /industries/{industry}/{practice}      (combinatorial)
├── Regions                      /regions
│   └── {region}                 /regions/{region}
│       └── {practice}           /regions/{region}/{practice}           (combinatorial)
├── Technologies                 /technologies
│   └── {technology}             /technologies/{technology}
├── Case Studies                 /case-studies
│   └── {case-study}             /case-studies/{case-study}
├── Insights                     /insights
│   └── {insight}                /insights/{insight}
├── Resources                    /resources
│   └── {resource}               /resources/{resource}
├── Careers                      /careers
│   └── {job}                    /careers/{job}
├── Locations                    /locations
│   └── {location}               /locations/{location}
├── About                        /about
├── Contact                      /contact
├── Search                       /search
├── Privacy                      /privacy
├── Terms                        /terms
└── 404 / 500                    (implicit)
```

`Insights` is the public label for `resources` where `resource_type = blog`.
`Resources` covers `guide | webinar | research | news`. Both read the same table.

---

## 2. Page inventory & template matrix

| Page type            | Example URL                          | Template key        | Dynamic? | Indexable | Notes |
|----------------------|--------------------------------------|---------------------|----------|-----------|-------|
| Home                 | `/`                                  | `home`              | static   | yes       | Bespoke sections |
| Practice hub         | `/practices`                         | `practice-index`    | static   | yes       | Lists 7 practices |
| Practice             | `/practices/ai-bees`                 | `practice`          | dynamic  | yes       | 7 pages |
| Sub-service          | `/practices/ai-bees/ml-engineering`  | `sub-service`       | dynamic  | yes       | ~4 per practice |
| Industry hub         | `/industries`                        | `industry-index`    | static   | yes       | |
| Industry             | `/industries/healthcare`             | `industry`          | dynamic  | yes       | |
| Practice × Industry  | `/industries/healthcare/ai-bees`     | `industry-practice` | dynamic  | yes*      | Only for curated pairs (`pages` row exists) |
| Region hub           | `/regions`                           | `region-index`      | static   | yes       | |
| Region               | `/regions/usa`                       | `region`            | dynamic  | yes       | 6 pages |
| Region × Practice    | `/regions/usa/ai-bees`               | `region-practice`   | dynamic  | yes*      | Only for curated pairs |
| Technology hub       | `/technologies`                      | `technology-index`  | static   | yes       | |
| Technology           | `/technologies/aws`                  | `technology`        | dynamic  | yes       | |
| Case study hub       | `/case-studies`                      | `case-study-index`  | static   | yes       | |
| Case study           | `/case-studies/{slug}`               | `case-study`        | dynamic  | yes       | |
| Insights hub         | `/insights`                          | `insight-index`     | static   | yes       | `resource_type=blog` |
| Insight              | `/insights/{slug}`                   | `insight`           | dynamic  | yes       | |
| Resources hub        | `/resources`                         | `resource-index`    | static   | yes       | |
| Resource             | `/resources/{slug}`                  | `resource`          | dynamic  | yes       | |
| Careers hub          | `/careers`                           | `career-index`      | static   | yes       | |
| Job                  | `/careers/{slug}`                    | `career`            | dynamic  | yes       | `JobPosting` schema |
| Locations hub        | `/locations`                         | `location-index`    | static   | yes       | |
| Location             | `/locations/{slug}`                  | `location`          | dynamic  | yes       | LocalBusiness schema |
| About                | `/about`                             | `about`             | static   | yes       | |
| Contact              | `/contact`                           | `contact`           | static   | yes       | Primary conversion |
| Search               | `/search`                            | `search`            | static   | **no**    | `noindex,follow` |
| Legal                | `/privacy`, `/terms`                 | `legal`             | static   | yes       | |
| Error                | 404 / 500                            | `error`             | static   | **no**    | |

`yes*` = the combinatorial page is indexable only when a `pages` row has been
explicitly created for that pair (editorially curated), otherwise the route
returns 404. This prevents thin auto-generated doorway pages.

The template key is stored in `page_templates.key_name`; the Next.js app maps it
to a component in `features/<domain>/components/<Key>Template.tsx`.

---

## 3. Taxonomy

Slugs are the public identifier and must match `*.slug` in the database.

### 3.1 Practices (7 — fixed set)

| Slug              | Name            | Focus |
|-------------------|-----------------|-------|
| `talent-bees`     | Talent Bees     | Technology talent & staffing |
| `digital-bees`    | Digital Bees    | Digital transformation & software engineering |
| `ai-bees`         | AI Bees         | AI, automation, agents |
| `marketing-bees`  | Marketing Bees  | Digital marketing execution & strategy |
| `quality-bees`    | Quality Bees    | QA, test engineering |
| `servicenow-bees` | ServiceNow Bees | ServiceNow implementation & consulting |
| `energy-bees`     | Energy Bees     | Energy-sector technology & trading platforms |

### 3.2 Sub-services (data, never per-page code)

`practice → sub_service → template`. Seeded set lives in `PracticeSeeder`;
canonical list is owned by the business. Each has `practice_id`, `name`, `slug`
(unique within practice), `summary`, `body`, `status`, `sort_order`.

### 3.3 Industries (initial set — extensible)

`healthcare`, `banking-financial-services`, `insurance`, `retail-ecommerce`,
`manufacturing`, `energy-utilities`, `technology-software`,
`public-sector`, `telecom`, `logistics-supply-chain`.

### 3.4 Regions (6 — fixed set)

| Slug        | Name      | ISO |
|-------------|-----------|-----|
| `usa`       | USA       | US  |
| `uk`        | UK        | GB  |
| `europe`    | Europe    | EU  |
| `canada`    | Canada    | CA  |
| `australia` | Australia | AU  |
| `uae`       | UAE       | AE  |

### 3.5 Technologies (initial set — extensible)

`aws`, `microsoft-azure`, `google-cloud`, `openai`, `databricks`, `snowflake`,
`servicenow`, `salesforce`, `kubernetes`, `terraform`, `react`, `laravel`.

---

## 4. Content model

Every content entity documents: **purpose · key fields · relationships · URL ·
template · SEO · indexable**. Field-level detail is in
[`../data-model/schema.sql`](../data-model/schema.sql).

| Entity        | Purpose | Relationships | URL | Template | SEO | Index |
|---------------|---------|---------------|-----|----------|-----|-------|
| `Practice`    | One of the 7 core offerings | subServices, industries, technologies, regions, caseStudies, faqs, seo | `/practices/{slug}` | `practice` | morphOne | yes |
| `SubService`  | A capability inside a practice | practice, caseStudies, faqs, seo | `/practices/{practice}/{slug}` | `sub-service` | morphOne | yes |
| `Industry`    | A vertical we serve | practices, technologies, caseStudies, faqs, seo | `/industries/{slug}` | `industry` | morphOne | yes |
| `Region`      | A geography we operate in | practices, industries, locations, caseStudies, seo | `/regions/{slug}` | `region` | morphOne | yes |
| `Technology`  | A platform/tool we deliver on | practices, industries, caseStudies, partners, seo | `/technologies/{slug}` | `technology` | morphOne | yes |
| `CaseStudy`   | Proof / outcome story | practice(s), industry(ies), technology(ies), region(s), testimonials, media, seo | `/case-studies/{slug}` | `case-study` | morphOne | yes |
| `Resource`    | Blog / guide / webinar / research / news | categories, author, relatedContent, seo | `/insights/{slug}` or `/resources/{slug}` | `insight` / `resource` | morphOne | yes |
| `JobPosting`  | An open role | location, applications | `/careers/{slug}` | `career` | morphOne | yes |
| `Location`    | A physical office | region, jobPostings | `/locations/{slug}` | `location` | morphOne | yes |
| `Page`        | URL → template + entity binding | pageTemplate, pageable, secondary, sections | any | (its template) | morphOne | per-row |
| `Testimonial` | Client quote | related (morph) | — (embedded) | — | — | — |
| `Faq`         | Q&A | faqable (morph) | — (embedded) | — | — | — |
| `TeamMember`  | Leadership / people | — | `/about` (embedded) | — | — | — |
| `Partner`     | Alliance / certification | technology | `/about`, `/technologies/*` (embedded) | — | — | — |

### Relationship map (the content graph)

All cross-entity links are rows in **`entity_relations`**
(`subject_type/id` ↔ `related_type/id`, `relation_type`), plus the one hard
column `sub_services.practice_id`. No database foreign keys — integrity is
enforced in the module services.

```
                         ┌───────────┐
                         │  Practice │
                         └─────┬─────┘
             ┌───────────┬─────┼─────┬───────────┐
             ▼           ▼     ▼     ▼           ▼
       ┌──────────┐┌──────────┐ ┌──────┐  ┌────────────┐
       │ Industry ││Technology│ │Region│  │ SubService │
       └────┬─────┘└────┬─────┘ └──┬───┘  └─────┬──────┘
            └───────────┴──────────┴────────────┘
                             ▼
                        ┌──────────┐
                        │ CaseStudy│
                        └──────────┘
```

`relation_type` vocabulary: `related`, `featured`, `primary`, `delivered-in`
(region), `built-with` (technology).

---

## 5. URL rules (frozen)

1. Lowercase, kebab-case, no trailing slash, no file extensions.
2. One slug per entity, globally stable. Slug changes **must** create a
   `redirects` row (`301`).
3. Hub → detail is always `/{collection}` → `/{collection}/{slug}`.
4. **Combinatorial convention: parent-first.**
   - Industry × Practice → `/industries/{industry}/{practice}`
   - Region × Practice → `/regions/{region}/{practice}`
   - Never the reverse. Never mixed.
5. Canonical host: `https://www.teambees.com` (no `www`→ redirect handled at edge).
6. Query params (`?q=`, `?page=`, UTM) are never part of the canonical URL.
7. Pagination uses `?cursor=` and pages carry `rel=canonical` to page 1 of the list.

URL builders: [`frontend/config/routes.ts`](../../frontend/config/routes.ts) — the
only place paths are constructed.

---

## 6. Navigation architecture

Stored in `navigation_menus` (`key_name`) + `navigation_items`
(self-referencing `parent_id`). Seeded by `NavigationSeeder`.

### 6.1 Header (`key_name: header`)

`Practices` · `Industries` · `Technologies` · `Regions` · `Case Studies` ·
`Insights` · `Careers` · `About` — then `Search` icon + `Contact` CTA.

### 6.2 Mega menu — `Practices` (`key_name: mega-practices`)

Two columns, 7 practice links + a "View all practices" footer link:

```
Talent Bees        Marketing Bees
Digital Bees       Quality Bees
AI Bees            ServiceNow Bees
Energy Bees
                              → View all practices
```

`Industries`, `Technologies`, `Regions` open a simple dropdown (top 6 +
"View all") in a later iteration — header links resolve to the hub for now.

### 6.3 Footer (`key_name: footer`) — 4 columns

| Explore        | Company    | Practices        | Connect            |
|----------------|------------|------------------|--------------------|
| Industries     | About      | Talent Bees      | Contact            |
| Technologies   | Careers    | Digital Bees     | LinkedIn           |
| Regions        | Insights   | AI Bees          | X / Twitter        |
| Case Studies   | Privacy    | ServiceNow Bees  | contact@teambees…  |
| Locations      | Terms      | Energy Bees      | +1 (800) 886 9600  |

### 6.4 Breadcrumbs

Generated from the content hierarchy, never hand-authored:

| Page | Trail |
|------|-------|
| `/practices/ai-bees` | Home › Practices › AI Bees |
| `/practices/ai-bees/ml-engineering` | Home › Practices › AI Bees › ML Engineering |
| `/industries/healthcare/ai-bees` | Home › Industries › Healthcare › AI Bees |
| `/case-studies/{slug}` | Home › Case Studies › {title} |

Rendered by `components/navigation/Breadcrumbs.tsx`, which also emits
`BreadcrumbList` JSON-LD.

### 6.5 Internal linking (per template)

- **Practice:** related industries, technologies, regions, case studies, insights.
- **Industry:** practices serving it, relevant technologies, case studies.
- **Technology:** practices, industries, case studies "built with" it, partners.
- **Region:** practices delivered there, locations, case studies.
- **Case study:** the practice/industry/technology/region it belongs to.

Each "related X" block is driven by `entity_relations` and rendered by a shared
`RelatedContent` component.

---

## 7. How Google understands the site

- One XML sitemap index at `/sitemap.xml` → per-type child sitemaps
  (`/sitemap-practices.xml`, …), generated from published rows
  (`SitemapController`).
- Every indexable page: unique `<title>` + meta description from `seo_metadata`,
  self-referencing `rel=canonical`, and type-appropriate JSON-LD
  (`Organization` on Home, `Service` on Practice, `Article` on Insight,
  `JobPosting` on Career, `LocalBusiness` on Location, `BreadcrumbList`
  everywhere).
- `robots.txt` allows all except `/search`, `/api`, draft-mode URLs.
- Non-curated combinatorial URLs return a real `404` (no soft 404s, no thin
  pages).
- `hreflang` is out of scope for v1 (single `en` locale); revisit when regional
  content diverges.

---

## 8. Phase 1 deliverable checklist

| # | Deliverable | Where |
|---|-------------|-------|
| 1 | Sitemap | §1 |
| 2 | Page inventory | §2 |
| 3 | Template matrix | §2 + `page_templates` table (`PageTemplateSeeder`) |
| 4 | Taxonomy | §3 + `PracticeSeeder` / `IndustrySeeder` / `RegionSeeder` / `TechnologySeeder` |
| 5 | Relationship map | §4 + `entity_relations` (`EntityRelationSeeder`) |
| 6 | URL rules | §5 + `frontend/config/routes.ts` |
| 7 | Navigation structure | §6 + `navigation_*` tables (`NavigationSeeder`) |
| 8 | Content model | §4 + `docs/data-model/schema.sql` |
