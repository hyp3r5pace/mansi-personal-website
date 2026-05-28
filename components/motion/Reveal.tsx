"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Pixel offset from below before the element rises into place. */
  offset?: number;
  /** Animation delay in seconds. */
  delay?: number;
};

/**
 * Wrap a block to reveal on scroll. Fades + rises into view once,
 * then stays. Falls back to a snap render under reduced-motion.
 */
export function Reveal({ children, className, offset = 18, delay = 0 }: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={cn(className)}
      initial={reduced ? false : { opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
