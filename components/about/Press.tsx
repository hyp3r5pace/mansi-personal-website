import type { PressEntry } from "@/lib/about";

type PressProps = {
  entries: PressEntry[];
};

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  month: "short",
  year: "numeric",
});

export function Press({ entries }: PressProps) {
  if (entries.length === 0) return null;

  return (
    <section>
      <header className="mb-6">
        <p className="text-char-ink/55 font-mono text-[10px] uppercase tracking-widest">
          Selected press
        </p>
        <h2 className="font-display text-ink-indigo mt-1 text-3xl tracking-tight italic">
          Features
        </h2>
      </header>

      <ul className="divide-char-ink/15 divide-y divide-dashed">
        {entries.map((entry, i) => {
          const dateLabel = (() => {
            const d = new Date(entry.date);
            return Number.isNaN(d.getTime()) ? entry.date : dateFmt.format(d);
          })();
          const Tag = entry.href ? "a" : "div";
          const tagProps = entry.href
            ? {
                href: entry.href,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "group block py-5",
              }
            : { className: "py-5" };

          return (
            <li key={`${entry.publication}-${i}`}>
              <Tag {...tagProps}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="font-display text-ink-indigo text-xl italic group-[]:transition-colors group-hover:text-marigold-deep">
                    {entry.title}
                  </p>
                  <span className="text-char-ink/55 font-mono text-[10px] uppercase tracking-widest">
                    {entry.publication} · {dateLabel}
                  </span>
                </div>
              </Tag>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
