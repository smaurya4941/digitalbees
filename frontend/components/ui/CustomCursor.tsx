"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fast spring for inner dot
  const innerSpringConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  // Slower spring for outer circle
  const outerSpringConfig = { damping: 30, stiffness: 200, mass: 0.8 };

  const innerX = useSpring(mouseX, innerSpringConfig);
  const innerY = useSpring(mouseY, innerSpringConfig);
  
  const outerX = useSpring(mouseX, outerSpringConfig);
  const outerY = useSpring(mouseY, outerSpringConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Outer Circle */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-10 w-10 rounded-full border-[1.5px] border-[#f97316] hidden md:block"
        style={{ 
          x: outerX, 
          y: outerY,
          translateX: "-50%",
          translateY: "-50%" 
        }}
      />
      {/* Inner Dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-[#f97316] hidden md:block"
        style={{ 
          x: innerX, 
          y: innerY,
          translateX: "-50%",
          translateY: "-50%" 
        }}
      />
    </>
  );
}
