import type { TimelineEntry } from "@/lib/about";

type TimelineProps = {
  entries: TimelineEntry[];
};

/**
 * Vertical stitched line with marigold knots at each milestone. Year
 * floats left of the line, body content right of it.
 */
export function Timeline({ entries }: TimelineProps) {
  if (entries.length === 0) return null;

  return (
    <ol className="relative">
      {/* Stitch line — sits in the gutter; dashed border emulates kantha */}
      <span
        aria-hidden
        className="border-char-ink/30 absolute top-2 bottom-2 left-[5.25rem] border-l border-dashed sm:left-24"
      />

      {entries.map((entry, i) => (
        <li
          key={`${entry.year}-${i}`}
          className="relative grid grid-cols-[5rem_1fr] gap-6 py-6 sm:grid-cols-[6rem_1fr] sm:gap-8"
        >
          <span className="font-display text-rose-madder text-right text-2xl italic">
            {entry.year}
          </span>

          {/* Marigold knot, centered on the line */}
          <span
            aria-hidden
            className="bg-marigold-deep ring-paper absolute top-9 left-[4.85rem] h-3 w-3 rounded-full ring-4 sm:left-[5.65rem]"
          />

          <div className="pl-4 sm:pl-6">
            <p className="font-display text-ink-indigo text-xl tracking-tight italic">
              {entry.title}
            </p>
            {entry.place ? (
              <p className="text-char-ink/65 mt-1 font-mono text-[11px] uppercase tracking-widest">
                {entry.place}
              </p>
            ) : null}
            {entry.detail ? (
              <p className="text-char-ink/80 mt-2 max-w-prose">{entry.detail}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
