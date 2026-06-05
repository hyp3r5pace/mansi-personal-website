import Image from "next/image";
import { cn } from "@/lib/cn";

type KanthaPortraitProps = {
  src?: string;
  alt: string;
  className?: string;
};

/**
 * Portrait wrapped in a hand-drawn kantha-stitch frame. If no src is
 * provided, renders an editorial placeholder block in paper-deep with
 * the alt text floating as a caption — keeps the layout honest while
 * the real photo is being colour-corrected.
 */
export function KanthaPortrait({ src, alt, className }: KanthaPortraitProps) {
  return (
    <figure className={cn("relative", className)}>
      <div className="bg-paper-deep paper-grain ring-char-ink/15 relative aspect-[4/5] w-full overflow-hidden rounded-sm ring-1">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 640px) 18rem, 100vw"
            quality={90}
            className="object-cover"
          />
        ) : (
          <div className="from-rose-madder/15 via-marigold/10 to-ink-indigo/20 absolute inset-0 bg-gradient-to-br" />
        )}
      </div>

      {/* Kantha stitch frame — offset dashed outline */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 125"
        preserveAspectRatio="none"
        className="text-rose-madder pointer-events-none absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.4"
        strokeLinecap="round"
      >
        <rect
          x="1"
          y="1"
          width="98"
          height="123"
          rx="1"
          strokeDasharray="1.5 1.2"
        />
        <rect
          x="2.5"
          y="2.5"
          width="95"
          height="120"
          rx="0.8"
          strokeDasharray="0.6 1.1"
          opacity="0.55"
        />
      </svg>

      {/* Corner knots */}
      {[
        { left: "-6px", top: "-6px" },
        { right: "-6px", top: "-6px" },
        { left: "-6px", bottom: "-6px" },
        { right: "-6px", bottom: "-6px" },
      ].map((pos, i) => (
        <span
          key={i}
          aria-hidden
          className="bg-marigold-deep absolute h-2 w-2 rounded-full"
          style={pos}
        />
      ))}
    </figure>
  );
}
