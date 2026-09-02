# Responsive

Breakpoints (Tailwind defaults — do not customise): `sm 640 · md 768 · lg 1024
· xl 1280`. Design reference widths: **1440 / 1024 / 768 / 390**.

Grid: 12-col desktop, 8-col tablet, 4-col mobile via `grid-cols-*` + `gap-gutter`
(24px). Gutters: `--spacing-margin-mobile` 16px → `--spacing-margin-desktop`
64px, applied only by `<Container>`.

## Transformation rules (not "shrink the desktop")

| Region | ≥ lg | md | < md |
|---|---|---|---|
| Header | inline nav + Practices mega-menu | inline nav (condensed), no mega-menu | logo + hamburger → full-height drawer; Practices expands inline |
| Hero type | `display-md` | `display-md` | `headline-lg-mobile` |
| Card grids | 3–4 col | 2 col | 1 col |
| `ProofBar` | 3 across | 3 across | stacked |
| `ProcessSteps` | 4 across | 2 × 2 | vertical list |
| `SectionHeading` + action | row, action right | stacked | stacked |
| Footer | 5 col | 2–3 col | stacked (no accordion) |
| Breadcrumb | full trail | full trail | wraps; current page always visible |
| Sticky | header only | header only | header only |

## Checks

- No horizontal scroll at 320px or at 200% zoom.
- Tap targets ≥ 44px on touch.
- Images: `next/image` with explicit ratio; never reflow on load (CLS < 0.1).
- Section rhythm steps down on mobile: `section-lg` → effectively `section-md`
  spacing feel (handled by the fixed `py-section-*` scale; revisit if pages feel loose).
