/**
 * Motion tokens — mirrors the `--duration-*` / `--ease-*` custom properties in
 * globals.css. Use these instead of inline numbers so timing stays consistent
 * and tunable. Components must also honour `prefers-reduced-motion`
 * (see `useReveal` / framer-motion's `useReducedMotion`).
 */
export const duration = {
  instant: 0.08,
  fast: 0.16,
  normal: 0.24,
  slow: 0.4,
} as const;

export const ease = {
  standard: [0.2, 0, 0, 1],
  enter: [0, 0, 0, 1],
  exit: [0.3, 0, 1, 1],
} as const;

/** Standard "reveal on scroll" variant. */
export const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.enter },
  },
} as const;

/** Staggered container for lists of revealed children. */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
} as const;
