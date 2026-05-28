import { cn } from "@/lib/cn";

type JaliRevealProps = {
  className?: string;
  /** Tile size in px. */
  size?: number;
  /** 0–1 visual strength of the lattice. */
  opacity?: number;
  /** Tailwind text color class to tint the strokes via currentColor. */
  tintClassName?: string;
  /** Direction the lattice fades out. */
  fadeFrom?: "left" | "right" | "top" | "bottom" | "none";
};

const FADE_GRADIENT: Record<NonNullable<JaliRevealProps["fadeFrom"]>, string> = {
  left: "linear-gradient(to right, black 0%, transparent 100%)",
  right: "linear-gradient(to left, black 0%, transparent 100%)",
  top: "linear-gradient(to bottom, black 0%, transparent 100%)",
  bottom: "linear-gradient(to top, black 0%, transparent 100%)",
  none: "linear-gradient(black, black)",
};

/**
 * Decorative jali (lattice) backdrop. Renders an inline SVG <pattern>
 * so strokes inherit currentColor — tint via tintClassName.
 */
export function JaliReveal({
  className,
  size = 80,
  opacity = 0.18,
  tintClassName,
  fadeFrom = "right",
}: JaliRevealProps) {
  const mask = FADE_GRADIENT[fadeFrom];
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute", tintClassName, className)}
      style={{
        opacity,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="jali-tile" width={size} height={size} patternUnits="userSpaceOnUse" viewBox="0 0 80 80">
            <g fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="76" height="76" />
              <path d="M40 8 L52 28 L72 28 L56 42 L62 62 L40 50 L18 62 L24 42 L8 28 L28 28 Z" />
              <circle cx="40" cy="40" r="6" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#jali-tile)" />
      </svg>
    </div>
  );
}
