# TeamBees — Design Foundation

> Phase 2 deliverable. The token system and primitive/component contracts that
> everything visual is built from. Tokens live in
> [`frontend/styles/tokens/*.css`](../../frontend/styles/tokens) (Tailwind v4
> `@theme`, imported by `app/globals.css`); this document explains intent and usage.
>
> Companions: [patterns.md](patterns.md) (UX patterns / wireframes) ·
> [motion.md](motion.md) · [accessibility.md](accessibility.md) ·
> [responsive.md](responsive.md) ·
> [../architecture/frontend.md](../architecture/frontend.md) (code architecture).

**Hierarchy:** `Token → Primitive → Component → Section → Template → Page`.
Never skip a level — a page composes sections, a section composes components, a
component composes primitives, a primitive consumes tokens. No raw hex, no
arbitrary `px` in components.

---

## 1. Color

### Brand
Values are blueprint-exact (Website Design Blueprint §13.1).

| Token | Value | Blueprint name | Use |
|-------|-------|----------------|-----|
| `brand-navy` | `#0b1f3a` | TeamBees Navy | Primary brand surface, primary button |
| `brand-navy-deep` | `#071527` | Navy 900 | Footer, dark sections, hover of navy |
| `brand-navy-mid` | `#132b4f` | Navy 600 | Secondary headings, borders on dark |
| `brand-gold` | `#c6963a` | Bee Gold | CTA fills, borders, icons, 24px+ text |
| `brand-gold-soft` | `#e9d9ae` | Gold 200 | Gold text/icons **on navy**, subtle fills |
| `brand-gold-deep` | `#9c7326` | Gold 700 | Focus ring, gold text on light at 24px+ |
| `brand-gold-muted` | `#c6963a` | — | **Deprecated** alias of Bee Gold; do not use in new work |
| `brand-cream` | `#f7f3e8` | — | Warm neutral section background |
| `brand-ink` | `#0a0a0b` | — | Near-black |

### Practice accent tints (§13.4)
`practice-talent` `#4a6fa1` · `practice-digital` `#3f8fa5` · `practice-ai`
`#6b4fa1` · `practice-marketing` `#b8862b` · `practice-quality` `#4a8f6b` ·
`practice-servicenow` `#2e6b4f` · `practice-energy` `#8a5a2e`.

Tag chips and icon backgrounds only — never large fills, never body text.

### Neutral ramp
`neutral-0` (white) → `neutral-1000` (black), with `50,100,200,300,400,500,600,
700,800,900,950`. Text on light: `neutral-900`. Muted: `neutral-600`. Hairlines:
`neutral-200`.

### Semantic
Four roles — `success` / `warning` / `danger` / `info` — each with three tokens:

| Suffix | Role | Example |
|--------|------|---------|
| *(base)* | icon / border / accent | `text-success`, `border-danger` |
| `-surface` | tinted background | `bg-warning-surface` |
| `-strong` | text on the surface | `text-danger-strong` |

### Roles (semantic aliases — prefer these in components)
`canvas` / `canvas-raised` / `canvas-sunken` (`#f4f4f2`, Gray 100) — backgrounds.
`ink` (`#1b1b1b`) / `ink-muted` (`#4a4a4a`, Gray 700) / `ink-subtle` /
`ink-disabled` (`#9b9b9b`, Gray 400) / `ink-inverse` — text.
`hairline` / `hairline-strong` — borders.
`focus-ring` (`#9c7326`, Gold 700) — the single focus colour.

### Material-derived palette
The `primary`, `surface-*`, `on-*`, `outline*`, `secondary*`, `tertiary*`,
`glass-dark`, `navy-deep`, `gold-muted` tokens are retained because the current
homepage sections consume them. **New work uses the brand / neutral / semantic /
role tokens above.** The Material set will be retired when the homepage sections
are rebuilt on the primitives.

### Accessibility
Measured ratios (see Blueprint §13.5, §19.2):

- Body text `ink` on white **17.22:1**; `ink-muted` on white **8.86:1**, on
  `canvas-sunken` **8.05:1**. All pass AA and AAA.
- `ink-subtle` is for non-essential text only (captions, metadata).
  `ink-disabled` is for disabled/placeholder **only** — never body text.
- **Gold is never used for text on a light surface.** Bee Gold on white is
  2.68:1 and Gold 700 is 4.29:1 — both fail AA at eyebrow/body sizes. Gold text
  on light is permitted only at 24px+ bold (Gold 700 clears the 3:1 large-text
  bar). On navy, use `brand-gold-soft` (**13.09:1**).
- Eyebrows therefore render `ink-muted` on light and `brand-gold-soft` on dark.
- `focus-ring` is Gold 700, the only gold clearing 3:1 on every surface —
  white 4.29:1, Gray 100 3.90:1, navy 3.85:1, Navy 900 4.27:1. Applied as a 2px
  outline with 2px offset, defined once in `@layer base`.
- Gold button at rest is navy-on-gold (**6.83:1**); it inverts to navy/white on
  hover (**16.52:1**) because the blueprint's Gold 700 hover measures 3.87:1
  behind navy text — under AA for 16px semibold.
- Never signal state with colour alone (pair with icon / text).

---

## 2. Typography

Families: `--font-sans` (Inter) for everything, `--font-mono` (IBM Plex Mono)
for eyebrows/labels and code. Loaded via `next/font` — no layout shift.
`--font-heading` exists and currently resolves to `--font-sans`: Blueprint
§14.1 calls for a distinct geometric sans (Söhne, or General Sans as the free
substitute), but both are non-Google faces pending a licence/self-hosting
decision. Repointing that one token swaps every heading.

Sizes marked **†** are blueprint-exact (§14.2); the rest are system additions
the blueprint does not specify.

| Token | Desktop | Mobile | Weight | Use |
|-------|---------|--------|--------|-----|
| `display-lg` † | 56 / 64 | 36 / 44 | 700 | Homepage hero only |
| `display-md` | 52 / 60 | — | 800 | Template heroes |
| `headline-xl` | 48 / 56 | — | 700 | Section headline, big |
| `h1` † | 40 / 48 | 30 / 38 | 700 | Page `<h1>` |
| `h2` † | 28 / 36 | 24 / 32 | 700 | Section `<h2>` |
| `headline-lg` | 32 / 40 | — | 700 | Legacy section headline |
| `h3` † | 22 / 30 | 20 / 28 | 600 | Sub-section |
| `h4` / `title-md` | 20 / 28 | — | 600 | Card title |
| `body-lg` † | 18 / 28 | 17 / 26 | 400 | Lead paragraph |
| `body-md` † | 16 / 26 | 16 / 24 | 400 | Default body |
| `body-sm` † | 14 / 20 | 13 / 18 | 400 | Dense UI, captions in cards |
| `caption` | 12 / 16 | — | 400 | Metadata, helper text |
| `eyebrow` | 12 / 16 · +0.12em | — | 600 | Uppercase kicker above headings |
| `label-sm` | 12 / 16 · +0.05em | — | 600 | Form labels, tags |
| `button` † | 16 / 20 | 15 / 20 | 600 | Button text |
| `nav` | 15 / 20 | — | 500 | Header nav links |

Usage: `text-h2`, `text-body-md`, etc. The utility applies size **and**
line-height/letter-spacing/weight from the token — don't add `leading-*` /
`font-*` alongside it.

**Responsive:** the mobile column above is applied automatically. Tailwind emits
every `text-*` utility as `var(--text-<token>)`, so a `@media (max-width: 767px)`
block at the foot of `tokens/typography.css` redefines those custom properties
and rescales the whole system at the mobile breakpoint (Blueprint §18.1) — no
`md:` prefixes needed in components for the blueprint-defined tokens.
`text-wrap: balance` on headings, `pretty` on paragraphs (base).

---

## 3. Spacing, layout, grid

**Scale** (base 8px): `3xs 2` · `2xs 4` · `xs 8` · `sm 12` · `md 16` · `lg 24` ·
`xl 32` · `2xl 48` · `3xl 64` · `4xl 96` · `5xl 128`. Numeric utilities
(`p-4`, `gap-6`) are also available via Tailwind's ramp.

**Gutter / margins:** `margin-mobile` 16px, `margin-desktop` 64px — applied by
`<Container>` / `.container-page`. Never set page gutters by hand.

**Containers:** `container-narrow` 720 (reading) · `container-standard` 960 ·
`container-wide` 1200 · `container-max` 1280 (default).

**Section rhythm:** `<Section space="sm|md|lg">` → `py-section-sm` (64) /
`-md` (96) / `-lg` (128). A page alternates tones and holds rhythm:
`hero → md → md(sunken) → lg → md`.

**Grid:** 12-col desktop / 8-col tablet / 4-col mobile via Tailwind
(`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`, `gap-gutter`). Breakpoints are
Tailwind defaults — `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280.

---

## 4. Radius, elevation, borders

**Radius** (enterprise = restrained): `sm` 6 (inputs) · `DEFAULT` 8 · `md` 10 ·
`lg` 16 (cards, panels) · `xl` 24 · `2xl` 32 (feature media) · `full` (pills,
avatars). One element, one radius intent.

**Elevation:** `shadow-xs` → `shadow-xl`, all tuned on navy. Use sparingly —
`sm` for raised cards, `md` on hover, `lg`/`xl` for overlays only. `shadow-focus`
is the form-control focus ring.

**Borders:** `border-hairline` is the default 1px divider; `border-hairline-strong`
for input outlines and emphasis.

---

## 5. Motion

Tokens: `--duration-instant|fast|normal|slow` (80/160/240/400ms) and
`--ease-standard|enter|exit`. Mirrored in
[`frontend/lib/motion.ts`](../../frontend/lib/motion.ts) for framer-motion
(`duration`, `ease`, `revealVariants`, `staggerContainer`).

Rules:
- Motion is feedback, not decoration. Use for: hover, menu open/close, accordion,
  scroll-reveal, route transitions.
- `prefers-reduced-motion: reduce` is honoured globally in `@layer base`
  (animations/transitions collapse to ~0). `CustomCursor` disables itself;
  `ScrollReveal` should check `useReducedMotion()`.
- No infinite ambient animation on content.

---

## 6. Z-index

Named scale in `globals.css` (`--z-base … --z-cursor`). In components use the
matching numeric utility (`z-10`, `z-[200]` for the header). Never invent
one-off values.

---

## 7. Primitives (`frontend/components/ui/`)

| Primitive | Variants / props | Notes |
|-----------|------------------|-------|
| `Button` | `variant` primary·secondary·tertiary·ghost·danger · `size` sm·md·lg · `block` · `loading` · `iconLeft/Right` · `href` | Renders `<button>` or Next `<Link>` when `href` set. `aria-busy` while loading. |
| `TextLink` | `variant` inline·standalone·cta·muted · `withArrow` | Auto `target=_blank` + `rel` for external. |
| `Container` | `width` narrow·standard·wide·max · `as` | The only place page gutters are set. |
| `Section` | `space` sm·md·lg · `tone` canvas·sunken·navy · `containerWidth` | Wraps a `Container`. |
| `Icon` | `icon` (lucide) · `size` xs–xl · `label` | **The one way to render an icon.** 1.5px stroke. Decorative unless `label`. |
| `Badge` | `tone` neutral·brand·gold·+semantic · `size` | Status / category chip. |
| `Divider` | `orientation` | Semantic `<hr role=separator>`. |
| `Card` + `CardMedia/Body/Eyebrow/Title/Description` | `interactive` · `padded` · `href` (stretched-link) | Common shell: Media · Eyebrow · Title · Description · Meta · Action. |

## 8. Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `NavBar` (SiteHeader) | `components/layout/` | Sticky header, Practices mega-menu, mobile drawer, search + CTA. Data from `config/navigation.ts`. |
| `Footer` | `components/layout/` | 4 nav groups + contact + legal. Data-driven. |
| `Breadcrumbs` | `components/navigation/` | Trail from IA + `BreadcrumbList` JSON-LD. |
| `JsonLd` / `SeoJsonLd` | `components/seo/` | Structured-data script. |
| `Field` + `Input` + `Textarea` | `components/forms/` | Accessible field wrapper (label / hint / error wired via `aria-describedby`, `aria-invalid`). Shared control style in `controlStyles.ts`. Select/checkbox/radio/file: later. |

## 9. Forms foundation

`<Field label hint error required>` owns the `<label>`, hint, error and all
ARIA plumbing; the control (`<Input>` / `<Textarea>`) reads context via
`useField()` + `fieldAria()`. Every control state — default, focus (3px ring),
disabled, invalid (`aria-invalid` → danger border + ring) — comes from
`controlStyles.ts`. Error text uses `role="alert"`.

---

## 10. Phase 2 deliverable checklist

| # | Deliverable | Where |
|---|-------------|-------|
| 1 | Color tokens (brand / neutral / semantic / roles) | globals.css §1 |
| 2 | Typography tokens (display → nav) | globals.css §2 |
| 3 | Spacing system (3xs → 5xl) | globals.css §3 |
| 4 | Grid + containers | globals.css §3, `Container` |
| 5 | Breakpoints | Tailwind defaults §3 |
| 6 | Component states | `Button`, `controlStyles.ts` |
| 7 | Core primitives | `components/ui/` §7 |
| 8 | Core components (header, footer, breadcrumb, card, forms) | §8 |
| 9 | Motion system + reduced-motion | globals.css §5, `lib/motion.ts` |
| 10 | Accessibility foundation | focus ring, contrast, `Icon` labels, `Field` ARIA |

**Deferred (add later):** Select / Checkbox / Radio / FileUpload primitives,
Accordion, Tabs, Search input component, Tooltip, toast/feedback, full Figma
library, dark theme.
