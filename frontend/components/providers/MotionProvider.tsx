'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Site-wide reduced-motion handling for every framer-motion component
 * (blueprint §16.1 / §19.2). `reducedMotion="user"` follows the OS
 * `prefers-reduced-motion` setting: transform and layout animations are
 * disabled while opacity changes remain. CSS animations and transitions are
 * covered separately by the `@media (prefers-reduced-motion)` block in
 * styles/base/base.css.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
