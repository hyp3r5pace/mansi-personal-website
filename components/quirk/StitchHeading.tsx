"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type StitchHeadingProps = {
  children: React.ReactNode;
  className?: string;
  /** Underline tone — marigold by default. */
  tone?: "marigold" | "rose" | "indigo";
  as?: "h2" | "h3";
};

const TONE: Record<NonNullable<StitchHeadingProps["tone"]>, string> = {
  marigold: "text-marigold-deep",
  rose: "text-rose-madder",
  indigo: "text-ink-indigo",
};

/**
 * Heading that stitches itself into being on scroll. The dashed underline
 * is an SVG path with a large stroke-dashoffset; when the heading scrolls
 * into view, the offset animates to zero, simulating a needle running
 * through the line. Falls back to a static underline when reduced motion
 * is requested.
 */
export function StitchHeading({
  children,
  className,
  tone = "marigold",
  as: Tag = "h2",
}: StitchHeadingProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      // Reveal immediately; no scroll-tied animation when reduced motion is on.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <Tag className="font-display text-ink-indigo text-4xl tracking-tight italic sm:text-5xl">
        {children}
      </Tag>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        className={cn(
          "mt-1 block h-2 w-full",
          TONE[tone],
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path
          d="M2 6 C 40 2, 80 10, 120 5 S 180 4, 198 7"
          strokeDasharray="6 4"
          style={{
            strokeDashoffset: seen ? 0 : 220,
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </svg>
    </div>
  );
}
