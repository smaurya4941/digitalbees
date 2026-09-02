'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Decorative pointer. Only active on devices with a fine pointer (mouse) and
 * when the user has not requested reduced motion — otherwise the native cursor
 * is left untouched. Never renders two visible cursors.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const innerX = useSpring(mouseX, { damping: 25, stiffness: 400, mass: 0.5 });
  const innerY = useSpring(mouseY, { damping: 25, stiffness: 400, mass: 0.5 });
  const outerX = useSpring(mouseX, { damping: 30, stiffness: 200, mass: 0.8 });
  const outerY = useSpring(mouseY, { damping: 30, stiffness: 200, mass: 0.8 });

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compute = () => setEnabled(finePointer.matches && !reducedMotion.matches);

    compute();
    finePointer.addEventListener('change', compute);
    reducedMotion.addEventListener('change', compute);
    return () => {
      finePointer.removeEventListener('change', compute);
      reducedMotion.removeEventListener('change', compute);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add('has-custom-cursor');
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [enabled, mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-10 w-10 rounded-full border-[1.5px] border-brand-gold-muted"
        style={{ x: outerX, y: outerY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-brand-gold-muted"
        style={{ x: innerX, y: innerY, translateX: '-50%', translateY: '-50%' }}
      />
    </>
  );
}
