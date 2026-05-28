import { cn } from "@/lib/cn";

type ScribbleArrowProps = {
  className?: string;
  color?: string;
  direction?: "right" | "down" | "left" | "up";
};

/**
 * Hand-drawn arrow as inline SVG.
 * Default points right. Rotate via direction prop.
 */
export function ScribbleArrow({
  className,
  color = "currentColor",
  direction = "right",
}: ScribbleArrowProps) {
  const rotation = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  }[direction];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 24"
      className={cn("inline-block", className)}
      style={{ transform: `rotate(${rotation}deg)` }}
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12 C 14 8, 28 16, 42 11 S 56 9, 60 12" />
      <path d="M52 6 L60 12 L52 18" />
    </svg>
  );
}
