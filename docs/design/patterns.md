# TeamBees — UX Pattern Library & Wireframe Spec

> Phase 3 deliverable. The reusable UX patterns every page is assembled from,
> the section order per template, responsive rules, and component states.
> Fidelity here is structural, not visual — visual comes from
> [foundations.md](foundations.md); the coded system is in
> [../architecture/frontend.md](../architecture/frontend.md).

**The rule:** a new page is *assembled from patterns*, never designed from
scratch. If a page needs a pattern that isn't here, add it here first.

---

## 1. Global page anatomy

Every template is a subset of this spine, in this order:

```
Header ─ Breadcrumb ─ Page Hero ─ Primary content ─ Supporting content
        ─ Related content ─ Conversion band ─ Footer
```

- **Header / Footer** — from the `(website)` layout, never re-implemented.
- **Breadcrumb** — generated from the IA hierarchy ([../architecture/information-architecture.md](../architecture/information-architecture.md) §6.4), emits `BreadcrumbList` JSON-LD.
- **Hero** — one component, tone variants. Eyebrow · H1 · lead · 1–2 CTAs.
- **Conversion band** — `CTABand`, appears on every content page.

Not every page uses every slot; the *pattern* is fixed.

---

## 2. Pattern catalogue

| Pattern | Component | Purpose | Data |
|---|---|---|---|
| **Navigation** | `NavBar` / `Footer` | Global wayfinding; Practices mega-menu; mobile drawer | `config/navigation.ts` → `GET /navigation` |
| **Breadcrumb** | `Breadcrumbs` | Hierarchy + JSON-LD | derived from route + entity |
| **Hero** | `sections/Hero` | Page intro + primary action | `hero: { eyebrow, title, description, cta, secondary_cta }` |
| **Proof bar** | `sections/ProofBar` | Quantified credibility | `proof_points: [{ value, label }]` |
| **Section heading** | `sections/SectionHeading` | Eyebrow + H2 + lead + optional action | inline |
| **Card grid** | `cards/*` in `sections/*Grid` | Uniform browsing of entities | `EntitySummary[]` |
| **Service grid** | `sections/ServiceGrid` | Sub-services of a practice | `services: SubService[]` |
| **Process / steps** | `sections/ProcessSteps` | "How we work" 01→04 | `how_we_work: ProcessStep[]` |
| **Related content** | `sections/RelatedContent` | Cross-links (industries, tech, regions) | `EntitySummary[]` |
| **Related practices** | `sections/RelatedPractices` | Sibling practices | `PracticeSummary[]` |
| **CTA band** | `sections/CTABand` | Conversion | `cta: { label, url }` |
| **Stat** | inside `ProofBar` | Single metric | `{ value, label }` |
| **Testimonial** | `sections/Testimonial` *(later)* | Client quote | `Testimonial` |
| **Timeline** | `sections/Timeline` *(later)* | Company milestones / case-study approach | `[{ year, title, body }]` |
| **Logo strip** | `sections/LogoStrip` *(later)* | Client / partner logos | `Media[]` |
| **Accordion** | `common/Accordion` *(later)* | FAQ, dense content | `Faq[]` |
| **Tabs** | `common/Tabs` *(later)* | Segmented content | inline |
| **Search** | `features/search/*` *(later)* | Site search + filters + states | `GET /search` |
| **Filters** | `common/Filters` *(later)* | Faceted narrowing (careers, insights) | facet config |
| **Pagination** | `common/Pagination` *(later)* | Cursor paging | envelope `links` |
| **Form** | `forms/*` | Conversion capture | Zod schema → `POST /leads` |
| **Chat** | `features/chatbot/*` *(later)* | Bee Assistant | `POST /chatbot/message` |

`*(later)*` = pattern is specified but not yet built; add when the first
template needs it.

---

## 3. Template section order

Each template composes patterns top-to-bottom. `✓` = built.

### `practice` ✓  — `/practices/{slug}`
`Breadcrumb → Hero → ProofBar → ServiceGrid → ProcessSteps → RelatedContent(industries) → RelatedContent(technologies) → RelatedContent(regions) → RelatedPractices → CTABand`

### `practice-index` ✓ — `/practices`
`Breadcrumb → SectionHeading → PracticeCard grid → CTABand`

### `industry` — `/industries/{slug}`
`Breadcrumb → Hero → ProofBar → Challenges → RelatedContent(practices) → RelatedContent(technologies) → CaseStudies → Insights → RelatedContent(industries) → CTABand`

### `industry-practice` — `/industries/{industry}/{practice}` *(curated only)*
`Breadcrumb → Hero → IndustryChallenges → PracticeCapabilities → Solutions → ProcessSteps → RelatedContent(technologies) → CaseStudies → RelatedContent(pairs) → CTABand`
Must read as *"specifically what TeamBees does for this industry"* — not a copy of the practice page.

### `region` — `/regions/{slug}`
`Breadcrumb → Hero → RegionalProof → About-in-region → RelatedContent(practices) → RelatedContent(industries) → CaseStudies → Locations → RegionalCTA`

### `region-practice` — `/regions/{region}/{practice}` *(curated only)*
`Breadcrumb → Hero → LocalValueProp → LocalCapabilities → RelatedContent(industries) → CaseStudies → RelatedPractices → RegionalCTA`

### `case-study` — `/case-studies/{slug}`
`Breadcrumb → Hero(client + industry) → Challenge → Context → Approach(steps) → Solution → Technology → Results(stats) → Testimonial → RelatedContent(case-studies) → CTABand`

### `career` — `/careers/{slug}` · `career-index` — `/careers`
Index: `Hero → Why → Culture → Benefits → Teams → JobList(search + filters) → Process → Stories → FAQ → CTABand`
Detail: `Breadcrumb → JobHeader(title, location, dept, level) → Description → Responsibilities → Requirements → Benefits → ApplyForm`

### `contact` — `/contact`
`Hero → ContactOptions → InquirySelector → LeadForm(fields driven by intent) → Locations → FAQ`

### `search` — `/search` *(noindex)*
`SearchInput → Filters(All · Practices · Industries · Technologies · Case Studies · Insights · Careers) → Results | Loading | Empty | Error → LoadMore`

### `error` — 404 ✓ / 500 *(noindex)*
`Code → Message → [Go home] [Explore practices] [Search]`

---

## 4. Responsive rules

Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280` (Tailwind defaults). Design
at 1440 / 1024 / 768 / 390.

| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| Header nav | inline links + mega-menu | inline (condensed) | hamburger → drawer, Practices expands inline |
| Hero | text block, 3xl type | text block, xl type | text block, `headline-lg-mobile` |
| Card grids | 3–4 col | 2 col | 1 col, stacked |
| ProofBar | 3 across | 3 across | stacked, 1 per row |
| ProcessSteps | 4 across | 2×2 | vertical list |
| Footer | 5 col | 2–3 col | accordion-free stacked |
| Breadcrumb | full trail | full trail | wraps; never truncates the current page |

Never just shrink desktop: define what stacks, what collapses to an accordion,
what changes order, what becomes sticky (header only).

---

## 5. Component states (development checklist)

| Component | Default | Hover | Focus | Active | Disabled | Loading | Error |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Button | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| TextLink | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Input / Textarea | ✓ | ✓ | ✓ (3px ring) | — | ✓ | — | ✓ (`aria-invalid`) |
| Card (interactive) | ✓ | ✓ (lift) | ✓ (within) | — | — | — | — |
| NavBar | ✓ | ✓ | ✓ | ✓ (route) | — | — | — |
| MegaMenu | closed | open (hover) | open (focus) | — | — | — | — |
| Accordion *(later)* | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Form (whole) | ✓ | — | — | — | ✓ (submitting) | ✓ | ✓ (summary) |

### Data-driven view states (every list / detail fetch)
`loading` (skeleton) · `empty` (explain + next action) · `error` (retry) ·
`not-found` (→ `notFound()` → 404). Templates receive resolved data; pages own
the loading/error boundary.

---

## 6. CTA strategy

- **Primary site CTA:** "Start a conversation" → `/contact`. Present on every
  content page (hero secondary + closing `CTABand`).
- **Practice/Industry hero:** primary = contact, secondary = explore the hub.
- **Never** more than one primary CTA visible per viewport.
- Persona fork (Business / Talent / Partner) — homepage only, and only if
  analytics show visitors need disambiguation; not a default.

---

## 7. Exit criteria (Phase 3)

- [x] Global page anatomy
- [x] Pattern catalogue with data contracts
- [x] Section order for every template in the matrix
- [x] Responsive rules
- [x] Component-state matrix + view-state rules
- [x] CTA strategy
- [x] `practice` + `practice-index` patterns proven in code
- [ ] Remaining templates implemented (industry → case-study → …), each reusing these patterns
