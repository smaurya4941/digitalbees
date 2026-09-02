# TeamBees Corp Website - Laravel Production Roadmap

## 1. Overall production roadmap

The project is divided into 14 major phases:

- **PHASE 0**  → Understand & Freeze Requirements
- **PHASE 1**  → Product / Information Architecture
- **PHASE 2**  → Design Foundation
- **PHASE 3**  → UX & Wireframes
- **PHASE 4**  → High-Fidelity Design
- **PHASE 5**  → Design System → Blade Component System
- **PHASE 6**  → Laravel Architecture & Infrastructure
- **PHASE 7**  → Database / CMS / Content Architecture
- **PHASE 8**  → Core Website Development
- **PHASE 9**  → SEO Architecture
- **PHASE 10** → Forms / CRM / Search / Chatbot / Analytics
- **PHASE 11** → Security / Performance / Accessibility
- **PHASE 12** → Content Population & Page Scaling
- **PHASE 13** → QA / UAT / Production Hardening
- **PHASE 14** → Production Launch & Continuous Governance

---

## PHASE 0 — Freeze the project requirements

Before touching Figma or Laravel, create a Project Master Specification based on the blueprint.

**0.1 Establish the business model**
- TeamBees positioning: Talent + Technology from the same partner
- Target customers & personas
- Services, Industries, Technologies, Regions

**0.2 Establish the seven practices**
- Talent Bees, Digital Bees, AI Bees, Marketing Bees, Quality Bees, ServiceNow Bees, Energy Bees

**0.3 Establish the regions**
- USA, UK, Europe, Canada, Australia, UAE

**0.4 Establish the content taxonomy**
- Practice, Sub-Service, Industry, Region, Technology, Case Study, Resource, Blog, Career, Location

---

## PHASE 1 — Information Architecture

Determine which templates can generate the 300+ pages.

**1.1 Create the page taxonomy**
- Dynamic combinations: Practice, Practice × Industry, Region, Region × Practice, Technology, Sub-Service

---

## PHASE 2 — Design Foundation

Start with the design tokens.

**2.1 Design tokens**
- Primary: Deep Navy, Warm Gold, Cream, White, Black
- Semantic: Success, Warning, Error, Info

**2.2 Typography**
- Define: Display, H1-H4, Body Large/Medium/Small, Caption, Eyebrow, Button, Navigation

**2.3 Spacing system & Grid**
- Build a scale (XS to 4XL). Define max content width, gutters, desktop/tablet/mobile grids.

---

## PHASE 3 — UX / Wireframes

Identify patterns with low-fidelity wireframes.
- Global: Header, Footer, Mega menu
- Pages: Homepage, Practice hub, Industry page, Case study, Careers, Contact, Search, Forms, Chatbot

---

## PHASE 4 — High-fidelity visual design

Apply the TeamBees visual identity:
- Confident enterprise, not corporate-generic.
- Use deep navy, warm gold, strong typography, generous whitespace.

---

## PHASE 5 — Build the Design System

Bridge Figma and Laravel.

**5.1 Component hierarchy**
- Level 1 — Tokens
- Level 2 — Primitives (Button, Badge, Icon, Input)
- Level 3 — Components (Card, Stat, Accordion, Breadcrumb)
- Level 4 — Sections (Hero, Proof Bar, Practice Grid)
- Level 5 — Templates (PracticeTemplate, IndustryTemplate)
- Level 6 — Pages (Actual CMS data rendered)

---

## PHASE 6 — Laravel architecture

Use MVC + Repository + Service Container with lightweight controllers.

**6.1 Recommended architecture**
`Controller -> DTO / Form Request -> Service -> Repository -> Model`

**6.2 Controller responsibility**
Receive request -> Validate -> Call service -> Return response/view. (No heavy DB or business logic).

**6.3 Services**
Handle business operations (e.g., `LeadService`, `PracticeService`).

**6.4 Repository layer**
Handle data access (e.g., `PracticeRepositoryInterface` -> `EloquentPracticeRepository`).

---

## PHASE 7 — Recommended folder structure

```text
app/
├── Http/
│   ├── Controllers/Web/
│   └── Requests/
├── Models/
├── Repositories/
│   ├── Contracts/
│   └── Eloquent/
├── Services/
├── DTOs/
├── Actions/
└── Support/
```

**7.1 Resources/views structure**
```text
resources/
├── views/
│   ├── layouts/
│   ├── pages/
│   ├── templates/
│   └── components/
└── css/
```

---

## PHASE 8 — Database / CMS architecture

Make Laravel the content management/backend platform.

**8.1 Core tables/entities**
- users, roles, practices, sub_services, industries, regions, technologies, case_studies, resources, careers, leads, seo_metadata.

**8.2 Taxonomy relationships**
Use relational tables, not comma-separated strings.

---

## PHASE 9 — Dynamic page architecture

Map templates to dynamic data to sustain 300+ pages without hardcoding.
e.g. `/practices/{practice}` loads the `Practice Template` with CMS data.

---

## PHASE 10 — Build the website in the correct order

- **Sprint 1:** Infrastructure
- **Sprint 2:** Design system components
- **Sprint 3:** Global shell (Header/Footer)
- **Sprint 4:** Homepage
- **Sprint 5:** Practice template & content
- **Sprint 6:** Industry system
- **Sprint 7:** Region system
- **Sprint 8:** Technology & Case studies
- **Sprint 9:** Resources & Careers
- **Sprint 10:** Contact & Conversion

---

## PHASE 11 — Forms / CRM architecture

Form Request -> `LeadService` -> Store locally -> Queue Job -> `CRMService` -> CRM API.
Keep lead scoring logic separate (`LeadScoringService`).

---

## PHASE 12 — Search & SEO architecture

**Search:** CMS -> Search Indexer (Algolia/Meilisearch) -> `SearchService` -> Blade Results.
**SEO:** Centralized SEO mechanism (titles, canonical, schema, breadcrumbs), dynamic sitemaps, redirect management.

---

## PHASE 13 — Performance & Security

**Performance:** LCP < 2.5s, INP < 200ms, CLS < 0.1. Utilize server-rendered HTML, caching, image optimization (WebP), lazy loading.
**Security:** HTTPS, CSP, CSRF, server-side validation, rate limiting, secure DB practices.

---

## PHASE 14 — QA, Content Population & Launch

- **Accessibility:** Keyboard, screen reader, contrast, semantic HTML.
- **Testing:** Unit, Feature, Browser/E2E, Visual Regression.
- **Content:** Scale to 300+ pages only after templates are stable.
- **Observability:** Monitor 500s, performance, traffic, uptime.

### Final working order summary:
1. Requirements & Taxonomy -> 2. Design Tokens & Components -> 3. Laravel Infrastructure & DB -> 4. Blade Components & Templates -> 5. Forms, CRM, Search, SEO -> 6. Content Population -> 7. QA, Security, Launch.
