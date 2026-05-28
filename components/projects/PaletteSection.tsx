import type { Project } from "@/lib/mdx";

/**
 * Named-swatch row used at the bottom of a case study.
 * Larger and labelled, unlike the inline SwatchRow on tiles.
 */
export function PaletteSection({ project }: { project: Project }) {
  if (project.palette.length === 0) return null;
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
      <p className="text-char-ink/55 font-mono text-[10px] uppercase tracking-widest">
        Palette
      </p>
      <h2 className="font-display text-ink-indigo mt-1 text-3xl tracking-tight italic">
        Colour & material
      </h2>
      <ul className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {project.palette.map((s) => (
          <li key={s.hex + s.name} className="flex flex-col gap-3">
            <span
              aria-hidden="true"
              className="ring-char-ink/10 block h-24 w-full rounded-sm ring-1"
              style={{ backgroundColor: s.hex }}
            />
            <div>
              <p className="font-display text-ink-indigo text-lg italic">{s.name}</p>
              <p className="text-char-ink/60 font-mono text-[11px] uppercase tracking-widest">
                {s.hex}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
