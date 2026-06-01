import { cn } from "@/lib/cn";

type EnvelopeProps = {
  /** When true, the flap drops into the closed position. */
  closed?: boolean;
  className?: string;
};

/**
 * Stitched envelope SVG. The flap is a separate <path> that rotates
 * around its top edge — closed via a CSS transform set by the parent
 * state, gated behind prefers-reduced-motion via the global rule in
 * globals.css (transitions collapse to ~instant when reduced).
 */
export function Envelope({ closed = false, className }: EnvelopeProps) {
  return (
    <svg
      viewBox="0 0 160 110"
      role="img"
      aria-label="Envelope"
      className={cn("text-rose-madder", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Body */}
      <rect
        x="6"
        y="22"
        width="148"
        height="82"
        rx="3"
        strokeDasharray="3 2"
        className="text-ink-indigo"
      />

      {/* Inner stitch */}
      <rect
        x="10"
        y="26"
        width="140"
        height="74"
        rx="2"
        strokeDasharray="1 2"
        strokeWidth="1"
        opacity="0.45"
        className="text-ink-indigo"
      />

      {/* Letter peeking from inside (visible until flap closes) */}
      <g
        className={cn(
          "origin-center transition-all duration-700 ease-out",
          closed ? "opacity-0 translate-y-2" : "opacity-100",
        )}
      >
        <rect
          x="32"
          y="38"
          width="96"
          height="50"
          rx="1.5"
          className="text-paper-deep fill-paper-deep"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.95"
        />
        <line x1="42" y1="50" x2="118" y2="50" strokeWidth="0.8" className="text-char-ink" opacity="0.6" />
        <line x1="42" y1="58" x2="106" y2="58" strokeWidth="0.8" className="text-char-ink" opacity="0.45" />
        <line x1="42" y1="66" x2="118" y2="66" strokeWidth="0.8" className="text-char-ink" opacity="0.45" />
        <line x1="42" y1="74" x2="92" y2="74" strokeWidth="0.8" className="text-char-ink" opacity="0.45" />
      </g>

      {/* Flap — rotates around top edge */}
      <path
        d="M6 24 L80 70 L154 24"
        strokeDasharray="3 2"
        className={cn(
          "origin-top transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          closed ? "translate-y-0 rotate-0" : "-translate-y-[44px] rotate-x-180",
        )}
        style={{
          transformOrigin: "80px 24px",
          transform: closed ? "rotateX(0deg)" : "rotateX(180deg)",
          transformBox: "fill-box",
        }}
      />

      {/* Wax seal — drops in when closed */}
      <circle
        cx="80"
        cy="64"
        r="9"
        className={cn(
          "text-marigold-deep fill-marigold transition-all duration-500",
          closed ? "opacity-100 scale-100 delay-700" : "opacity-0 scale-50",
        )}
        stroke="currentColor"
        strokeWidth="1.2"
        style={{ transformOrigin: "80px 64px" }}
      />
    </svg>
  );
}
