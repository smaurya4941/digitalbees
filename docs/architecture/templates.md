# Template Architecture — 300+ pages from a handful of templates

> Phase 5. How dynamic routing + templates + structured data scale without
> hand-coding pages.

## The principle

**Never** `ai-bees/page.tsx`, `digital-bees/page.tsx`, … One dynamic route per
entity type:

```
app/(website)/practices/[practice]/page.tsx
        │
        ├─ generateStaticParams()  → [{ practice: 'ai-bees' }, … ]   (from GET /practices)
        ├─ generateMetadata()      → toMetadata(seo)
        └─ default()               → getPractice(slug) → notFound() | <PracticeTemplate/>
```

All 7 practices — and any added in the CMS later — render through the single
`PracticeTemplate`. Verified: `/practices/{talent,digital,ai,marketing,quality,servicenow,energy}-bees`
all return 200 from one component.

## Template = ordered section composition

| Template | Sections (in order) | Status |
|---|---|---|
| `PracticeTemplate` | Breadcrumb · Hero · ProofBar · ServiceGrid · ProcessSteps · RelatedContent×3 · RelatedPractices · CTABand | **built** |
| `PracticeIndexTemplate` | Breadcrumb · SectionHeading · PracticeCard grid · CTABand | built (inline in page) |
| `IndustryTemplate` | Breadcrumb · Hero · ProofBar · Challenges · RelatedContent(practices, tech) · CaseStudies · Insights · CTABand | planned |
| `IndustryPracticeTemplate` | Breadcrumb · Hero · IndustryChallenges · Capabilities · Solutions · ProcessSteps · Tech · CaseStudies · CTABand | planned |
| `RegionTemplate` | Breadcrumb · Hero · RegionalProof · RelatedContent(practices, industries) · CaseStudies · Locations · CTABand | planned |
| `RegionPracticeTemplate` | Breadcrumb · Hero · LocalValueProp · LocalCapabilities · Industries · CaseStudies · RelatedPractices · CTABand | planned |
| `CaseStudyTemplate` | Breadcrumb · Hero · Challenge · Context · Approach · Solution · Technology · Results · Testimonial · Related · CTABand | planned |
| `CareerTemplate` / `CareerIndexTemplate` | see patterns.md §3 | planned |
| `ContactTemplate` · `SearchTemplate` · `LegalTemplate` · `ErrorTemplate` | see patterns.md §3 | `error` built |

Section components are shared across templates — `Hero`, `ProofBar`,
`RelatedContent`, `CTABand`, `SectionHeading`, `ProcessSteps` are template-agnostic.

## Combinatorial pages (`industry-practice`, `region-practice`)

Curated only. A pair page exists **iff** a `pages` row was created for it
(editorial decision). Route handler:

```
getPair(industry, practice)  →  null  →  notFound()   (no thin doorway pages)
```

`generateStaticParams` returns only the curated pairs; `dynamicParams` stays
`true` so a newly-curated pair renders on first request.

## Adding a new template — checklist

1. Types in `types/<entity>.ts` (contract from `api-contracts.md`).
2. `lib/api/<entity>.ts` (`get<Entity>`, `get<Entities>`, cache tags).
3. Backend: repository contract + Eloquent impl + service + resources + controller + module provider + Feature test.
4. `templates/<Entity>Template/` composing existing sections; add a new section only if `patterns.md` lists it.
5. `app/(website)/<entities>/[slug]/page.tsx` — `generateStaticParams`, `generateMetadata`, `notFound()` guard.
6. Seed `page_templates` key + navigation if needed.
7. DoD in [frontend.md](frontend.md): all records render through the one template.

## Progress metric

Not "pages coded" — **templates working with reusable structured data**:

`2 / ~14 templates` (`practice`, `practice-index`, plus `error`).
