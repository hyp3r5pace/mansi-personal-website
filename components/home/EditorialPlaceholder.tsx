import { cn } from "@/lib/cn";
import type { Swatch } from "@/components/content/SwatchRow";

type EditorialPlaceholderProps = {
  title: string;
  palette?: Swatch[];
  category?: string;
  year?: number;
  className?: string;
  ratio?: "portrait" | "landscape" | "square";
};

const RATIO_CLASS: Record<NonNullable<EditorialPlaceholderProps["ratio"]>, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

const FALLBACK_PALETTE: Swatch[] = [
  { name: "ink", hex: "#1F2A56" },
  { name: "marigold", hex: "#E8A33D" },
  { name: "paper", hex: "#F6EFE2" },
];

/**
 * Editorial cover placeholder. Renders a vertical color-band composition
 * built from the project's palette, with the title and meta typeset over
 * it. Used wherever a real photo path doesn't (yet) resolve.
 */
export function EditorialPlaceholder({
  title,
  palette,
  category,
  year,
  className,
  ratio = "portrait",
}: EditorialPlaceholderProps) {
  const bands = (palette && palette.length > 0 ? palette : FALLBACK_PALETTE).slice(0, 5);
  const widths = bandWidths(bands.length);
  const labelOnDark = isDark(bands[0].hex);

  return (
    <div
      className={cn(
        "ring-char-ink/10 paper-grain relative w-full overflow-hidden rounded-sm ring-1",
        RATIO_CLASS[ratio],
        className,
      )}
    >
      <div className="absolute inset-0 flex">
        {bands.map((s, i) => (
          <div
            key={s.hex + i}
            className="h-full"
            style={{ width: widths[i], backgroundColor: s.hex }}
            aria-hidden="true"
          />
        ))}
      </div>

      <div
        className={cn(
          "relative flex h-full flex-col justify-between p-5 sm:p-7",
          labelOnDark ? "text-paper" : "text-ink-indigo",
        )}
      >
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest opacity-80">
          <span>{category ?? "Project"}</span>
          {year ? <span>{year}</span> : null}
        </div>

        <h3 className="font-display text-3xl leading-[1.05] tracking-tight italic sm:text-4xl">
          {title}
        </h3>
      </div>
    </div>
  );
}

function bandWidths(n: number): string[] {
  if (n === 1) return ["100%"];
  if (n === 2) return ["62%", "38%"];
  if (n === 3) return ["44%", "32%", "24%"];
  if (n === 4) return ["38%", "26%", "20%", "16%"];
  return ["32%", "24%", "18%", "14%", "12%"];
}

function isDark(hex: string): boolean {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luma < 0.55;
}
