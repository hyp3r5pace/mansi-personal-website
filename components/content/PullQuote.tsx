import { cn } from "@/lib/cn";

type PullQuoteProps = {
  children: React.ReactNode;
  attribution?: string;
  className?: string;
  /** rose-madder is the default editorial accent; allow override. */
  tone?: "rose" | "indigo" | "marigold";
};

const TONE_CLASS: Record<NonNullable<PullQuoteProps["tone"]>, string> = {
  rose: "text-rose-madder border-rose-madder/40",
  indigo: "text-ink-indigo border-ink-indigo/40",
  marigold: "text-marigold-deep border-marigold-deep/40",
};

/**
 * Block-level pull quote for case studies and journal posts.
 * Hangs the opening glyph into the left margin via a CSS pseudo so the
 * body copy aligns visually with surrounding paragraphs.
 */
export function PullQuote({ children, attribution, className, tone = "rose" }: PullQuoteProps) {
  return (
    <figure
      className={cn(
        "relative my-12 border-l-2 pl-6 sm:my-16 sm:pl-10",
        TONE_CLASS[tone],
        className,
      )}
    >
      <blockquote className="font-display text-2xl leading-snug tracking-tight italic sm:text-3xl">
        {children}
      </blockquote>
      {attribution ? (
        <figcaption className="text-char-ink/60 mt-4 font-mono text-xs uppercase tracking-widest">
          — {attribution}
        </figcaption>
      ) : null}
    </figure>
  );
}
