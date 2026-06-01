"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type HeroBorderProps = {
  className?: string;
};

/**
 * Hand-stitched kantha frame for the hero portrait — two offset running-
 * stitch outlines in rose-madder with marigold corner knots, echoing the
 * KanthaPortrait treatment on the About page so the pages rhyme.
 *
 * On mount the stitches march into place (animated strokeDashoffset, NOT
 * pathLength — pathLength also drives strokeDasharray and would clobber the
 * stitch pattern) and the knots pop in afterwards.
 *
 * Fills its positioned parent — wrap a padded container around the image
 * and drop this in as the first child. preserveAspectRatio="none" stretches
 * the stitches to the frame; the ~3% non-uniform scale reads as hand-made.
 */
export function HeroBorder({ className }: HeroBorderProps) {
  const reduced = useReducedMotion();
  const stitch = reduced
    ? { duration: 0 }
    : { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 400"
      preserveAspectRatio="none"
      className={cn(
        "text-rose-madder absolute inset-0 h-full w-full overflow-visible",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      {/* Outer running stitch */}
      <motion.rect
        x="4"
        y="4"
        width="292"
        height="392"
        rx="3"
        strokeWidth="2"
        strokeDasharray="9 6"
        initial={reduced ? false : { strokeDashoffset: 60, opacity: 0 }}
        animate={{ strokeDashoffset: 0, opacity: 1 }}
        transition={stitch}
      />
      {/* Inner finer stitch, offset inward and running the other way */}
      <motion.rect
        x="9"
        y="9"
        width="282"
        height="382"
        rx="2.4"
        strokeWidth="1"
        strokeDasharray="3 5"
        initial={reduced ? false : { strokeDashoffset: -40, opacity: 0 }}
        animate={{ strokeDashoffset: 0, opacity: 0.55 }}
        transition={{ ...stitch, delay: reduced ? 0 : 0.15 }}
      />

      {/* Marigold corner knots — pop in once the stitches settle */}
      <g className="text-marigold-deep" stroke="none" fill="currentColor">
        {[
          { cx: 4, cy: 4 },
          { cx: 296, cy: 4 },
          { cx: 4, cy: 396 },
          { cx: 296, cy: 396 },
        ].map((k, i) => (
          <motion.circle
            key={`${k.cx}-${k.cy}`}
            cx={k.cx}
            cy={k.cy}
            initial={reduced ? false : { r: 0, opacity: 0 }}
            animate={{ r: 3.5, opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.9 + i * 0.08 }}
          />
        ))}
      </g>
    </svg>
  );
}
