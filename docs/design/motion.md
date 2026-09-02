# Motion

Tokens in `styles/tokens/motion.css`, mirrored in `lib/motion.ts`.

| Token | Value | Use |
|---|---|---|
| `--duration-instant` | 80ms | micro-feedback (press) |
| `--duration-fast` | 160ms | hover, colour, small transforms |
| `--duration-normal` | 240ms | menus, dropdowns, accordions |
| `--duration-slow` | 400ms | scroll reveal, page-level transitions |
| `--ease-standard` | `cubic-bezier(.2,0,0,1)` | default |
| `--ease-emphasized` | `cubic-bezier(.2,0,0,1.2)` | attention (rare) |
| `--ease-enter` / `--ease-exit` | decelerate / accelerate | element in / out |

## Rules

- Motion is **feedback, not decoration**. Allowed: hover, focus, menu open/close,
  accordion, scroll reveal, route transition, form submit.
- No infinite ambient animation on content. (The homepage's rotating badge and
  custom cursor are the only ambient motion, both decorative and gated.)
- Transform + opacity only (GPU-friendly). Never animate layout properties.
- **`prefers-reduced-motion: reduce`** collapses all animation/transition to
  ~0 globally (`styles/base/base.css`). `CustomCursor` disables itself;
  `ScrollReveal` must check framer-motion's `useReducedMotion()`.
- framer-motion: import `duration` / `ease` / `revealVariants` / `staggerContainer`
  from `lib/motion.ts` — no inline numbers.
