import { cn } from "@/lib/cn";

/**
 * "Thread came loose" illustration for 404/500 pages. A dashed kantha
 * line frays out of an empty stitched frame.
 */
export function LooseThread({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 180"
      role="img"
      aria-label="A line of stitching coming loose"
      className={cn("text-rose-madder", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="20"
        y="40"
        width="160"
        height="110"
        rx="3"
        strokeDasharray="6 5"
        className="text-ink-indigo"
      />

      <path
        d="M180 95 C 210 90, 230 110, 250 95 S 290 80, 310 95"
        strokeDasharray="6 5"
      />

      <path
        d="M310 95 C 304 100, 304 108, 312 110"
        strokeWidth="1.6"
        opacity="0.85"
      />

      <circle cx="315" cy="112" r="3" className="fill-marigold text-marigold-deep" />

      {[60, 90, 120, 150].map((x) => (
        <line
          key={x}
          x1={x}
          y1="70"
          x2={x + 28}
          y2="70"
          strokeDasharray="3 4"
          strokeWidth="1.4"
          className="text-ink-indigo"
          opacity="0.45"
        />
      ))}
    </svg>
  );
}
