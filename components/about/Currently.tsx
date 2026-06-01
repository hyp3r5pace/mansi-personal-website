import type { CurrentlyEntry } from "@/lib/about";

type CurrentlyProps = {
  entries: CurrentlyEntry[];
};

/**
 * Manually-edited "heartbeat" block — what she's making / reading /
 * listening to right now. Label as small uppercase chip, value as
 * serif italic prose.
 */
export function Currently({ entries }: CurrentlyProps) {
  if (entries.length === 0) return null;

  return (
    <section className="bg-paper-deep paper-grain stitch-border text-ink-indigo px-6 py-8 sm:px-10 sm:py-10">
      <header className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl tracking-tight italic sm:text-3xl">
          Currently
        </h2>
        <span className="text-char-ink/55 font-mono text-[10px] uppercase tracking-widest">
          updated by hand
        </span>
      </header>

      <dl className="grid gap-4 sm:grid-cols-2">
        {entries.map((entry) => (
          <div key={entry.label} className="flex flex-col gap-1">
            <dt className="text-char-ink/55 font-mono text-[10px] uppercase tracking-widest">
              {entry.label}
            </dt>
            <dd className="font-display text-ink-indigo text-lg italic leading-snug">
              {entry.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
