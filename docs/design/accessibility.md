# Accessibility — design-system requirement, not a phase

Target: **WCAG 2.2 AA**. Every primitive and template must satisfy this before
it is "done" (see [../architecture/frontend.md](../architecture/frontend.md) DoD).

## Foundations (built in)

| Concern | Implementation |
|---|---|
| Focus ring | 2px `--color-focus-ring`, 2px offset, on **every** `:focus-visible` (`styles/base/base.css`). Interactive components add their own `focus-visible:outline`. |
| Contrast | `ink` on `canvas` ≈ 13:1; `ink-muted` ≈ 8:1; `ink-subtle` ≥ 4.5:1 (non-essential only). Semantic `-strong` tokens are AA on their `-surface`. |
| Touch target | `--tap-target-min: 44px`; buttons `h-9/11/13`, nav/menu hit areas padded. |
| Reduced motion | global collapse via `@media (prefers-reduced-motion: reduce)`. |
| Colour independence | state is never colour-only — always paired with icon/text (form errors use `role="alert"` + text + border). |

## Per-component checklist

- [ ] Keyboard operable (Tab / Shift-Tab / Enter / Space / Esc / arrows where applicable)
- [ ] Visible focus (inherits the global ring or a stronger local one)
- [ ] Semantic HTML first; ARIA only to fill gaps
- [ ] Correct heading order (one `<h1>` per page, no skips)
- [ ] Names for icon-only controls (`Icon label=` / `aria-label`)
- [ ] Disabled conveys state without being a keyboard trap
- [ ] Announced errors (`role="alert"`, `aria-describedby`, `aria-invalid`)
- [ ] Respects `prefers-reduced-motion`
- [ ] Works at 320px and 200% zoom without horizontal scroll

## Patterns already covered

- **`Field` / `Input` / `Textarea`** — `<label htmlFor>`, hint + error wired via
  `aria-describedby`, `aria-invalid`, `role="alert"` on the error.
- **`NavBar`** — `aria-expanded` / `aria-haspopup` on the mega-menu trigger;
  drawer locks body scroll; labelled toggle.
- **`Breadcrumbs`** — `<nav aria-label="Breadcrumb">`, `aria-current="page"`.
- **`Icon`** — `aria-hidden` by default; `role="img"` + `aria-label` when meaningful.
- **`CustomCursor`** — `aria-hidden`, only on `(pointer: fine)` + no reduced motion.

## Known debt

Homepage sections (`components/home/*`) predate the system: `href="#"` links,
Material Symbols icons, unverified contrast. Fix on the homepage rebuild pass.
