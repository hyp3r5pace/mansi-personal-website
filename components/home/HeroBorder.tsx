"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type HeroBorderProps = {
  className?: string;
  color?: string;
};

/**
 * Decorative block-print-style frame for the hero image. Renders a
 * double-line rectangle with diamond corner motifs and small dots
 * along the long edges. Strokes draw themselves in on mount.
 *
 * The SVG scales to fill the parent — wrap a positioned container
 * around the image and drop this in.
 */
export function HeroBorder({ className, color = "currentColor" }: HeroBorderProps) {
  const reduced = useReducedMotion();
  const baseTransition = reduced
    ? { duration: 0 }
    : { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 400"
      preserveAspectRatio="none"
      className={cn("absolute inset-0 h-full w-full overflow-visible", className)}
      stroke={color}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer thin frame */}
      <motion.rect
        x="2"
        y="2"
        width="296"
        height="396"
        strokeWidth="1.25"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={baseTransition}
        vectorEffect="non-scaling-stroke"
      />
      {/* Inner frame, drawn after */}
      <motion.rect
        x="10"
        y="10"
        width="280"
        height="380"
        strokeWidth="0.75"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ ...baseTransition, delay: reduced ? 0 : 0.25 }}
        vectorEffect="non-scaling-stroke"
      />

      {/* Corner diamonds (block-print mukut motif) */}
      {[
        { x: 6, y: 6 },
        { x: 294, y: 6 },
        { x: 6, y: 394 },
        { x: 294, y: 394 },
      ].map((c, i) => (
        <motion.path
          key={`${c.x}-${c.y}`}
          d={`M ${c.x} ${c.y - 5} L ${c.x + 5} ${c.y} L ${c.x} ${c.y + 5} L ${c.x - 5} ${c.y} Z`}
          strokeWidth="1"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ ...baseTransition, delay: reduced ? 0 : 0.7 + i * 0.05 }}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Small dot row along the top edge */}
      {Array.from({ length: 11 }).map((_, i) => {
        const cx = 30 + i * 24;
        return (
          <motion.circle
            key={`top-${i}`}
            cx={cx}
            cy={20}
            r={1.2}
            fill={color}
            stroke="none"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 1 + i * 0.03 }}
          />
        );
      })}
      {/* Mirror at bottom */}
      {Array.from({ length: 11 }).map((_, i) => {
        const cx = 30 + i * 24;
        return (
          <motion.circle
            key={`bot-${i}`}
            cx={cx}
            cy={380}
            r={1.2}
            fill={color}
            stroke="none"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 1.05 + i * 0.03 }}
          />
        );
      })}
    </svg>
  );
}
