# Frontend Architecture (Next.js)

> Phase 5 deliverable. How the design system becomes code, and how 300+ pages
> are produced from a handful of templates.

```
Figma design system
   ↓  foundations.md
Web design tokens        frontend/styles/tokens/*.css   (@theme)
   ↓
Primitives               components/ui/*                 stable, token-only
   ↓
Components                components/{cards,navigation,forms,seo}/*
   ↓
Sections                  components/sections/*           full-width page bands
   ↓
Templates                 templates/<Name>Template/       page structure, data-in
   ↓
Pages                     app/(website)/**/page.tsx       fetch → resolve → render
   ↓
API / CMS data            Laravel  GET /api/v1/*
   ↓
Dynamic URLs → 300+ pages one [slug] route per entity type
```

## Directory structure

```
frontend/
├── app/
│   ├── layout.tsx                 root <html>, fonts, metadataBase
│   ├── not-found.tsx              global 404 (noindex)
│   ├── (website)/
│   │   ├── layout.tsx             NavBar + <main> + Footer
│   │   ├── page.tsx               homepage
│   │   └── practices/
│   │       ├── page.tsx           hub  (practice-index)
│   │       └── [practice]/page.tsx  detail (practice)  ← one file, 7+ pages
│   ├── (legal)/                   privacy, terms
│   └── api/revalidate/route.ts    on-demand ISR webhook
│
├── templates/<Name>Template/      composes sections from a typed contract
├── components/
│   ├── ui/                        Button, TextLink, Container, Section, Icon, Badge, Divider, Card
│   ├── sections/                  Hero, ProofBar, SectionHeading, ServiceGrid, ProcessSteps,
│   │                              RelatedContent, RelatedPractices, CTABand
│   ├── cards/                     PracticeCard, ContentCard
│   ├── navigation/                Breadcrumbs
│   ├── forms/                     Field, Input, Textarea, controlStyles
│   ├── seo/                       JsonLd
│   └── layout/                    NavBar, Footer
│
├── lib/
│   ├── api/                       client.ts (typed fetch + envelope), tags.ts, <entity>.ts
│   ├── seo/metadata.ts            SeoBlock → Next Metadata
│   ├── motion.ts                  duration/ease tokens + variants
│   └── utils/cn.ts
│
├── config/                        environment (zod), site, routes, navigation
├── types/                         common, pagination, seo, content, practice, …
└── styles/
    ├── tokens/{colors,typography,spacing,layout,radius,shadows,motion}.css
    ├── base/base.css
    └── utilities.css
```

## The 6 levels

| Level | Rule | Example |
|---|---|---|
| **Tokens** | CSS custom properties in `@theme`. Nothing else defines colour/space/type. | `--color-brand-navy` |
| **Primitives** | Token-only. No business logic. Controlled `variant`/`size`/`state` props — never arbitrary style props. Extremely stable. | `<Button variant="primary">` |
| **Components** | Compose primitives. Domain-aware shape, still presentational. | `<PracticeCard practice={…} />` |
| **Sections** | Full-width page bands. Compose components + `Container`/`SectionHeading`. Take a data array. | `<ServiceGrid services={…} />` |
| **Templates** | Page structure. Receive one typed contract, render sections in order. **No fetching, no knowledge of the data source.** | `<PracticeTemplate practice={…} />` |
| **Pages** | Tiny. `params → fetch → resolve-or-404 → <Template/>` + `generateStaticParams` + `generateMetadata`. | `app/(website)/practices/[practice]/page.tsx` |

## Server vs Client

Default = **Server Component**. `'use client'` only for interaction:

| Server | Client |
|---|---|
| Templates, sections, cards, pages | `NavBar` (mega-menu, drawer) |
| `lib/api/*` (`server-only`) | `CustomCursor`, `ScrollReveal` |
| `JsonLd`, SEO, breadcrumbs | `forms/*` (Field context, RHF) |
| Data resolution | Search UI, Accordion, Tabs, Chatbot *(later)* |

## Data flow & caching

1. Page calls `lib/api/<entity>.ts` → `lib/api/client.ts` → `fetch` with
   `next: { tags, revalidate: 3600 }`.
2. Envelope `{ data, meta, links }` is unwrapped (`apiGet` / `apiList`).
3. `404` → data fn returns `null` → page calls `notFound()`.
4. Editor publishes → Laravel `NotifyFrontendRevalidate` → `POST /api/revalidate`
   with `{ tags: ['practices','practice:ai-bees'] }` → `revalidateTag`.
5. Build resilience: if the API is unreachable during `next build`, data fns
   return an empty fallback so the build passes; ISR fills in at runtime.

## Design ↔ code naming bridge

| Figma | Code |
|---|---|
| `Button / Primary` | `<Button variant="primary">` |
| `Practice Card` | `<PracticeCard>` |
| `Section / Service Grid` | `<ServiceGrid>` |
| `Template / Practice` | `<PracticeTemplate>` |

## Definition of Done

**Component:** variants + all states designed & built · responsive · a11y
(keyboard, focus, semantics, contrast, touch target, reduced motion) · typed
props, no arbitrary styling · used on ≥1 template · no console errors.

**Template:** desktop + mobile · typed contract + API integration · loading /
empty / error / not-found states · SEO metadata + JSON-LD · breadcrumb ·
internal links · one real record renders · **all records of that type render
through the single template**.
