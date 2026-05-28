import { cn } from "@/lib/cn";

export type Swatch = { name: string; hex: string };

type SwatchRowProps = {
  swatches: Swatch[];
  className?: string;
  size?: "sm" | "md";
  showLabels?: boolean;
};

/**
 * Renders a horizontal row of small colored swatches. Used on project
 * tiles, case studies, and anywhere a palette needs a one-line stamp.
 */
export function SwatchRow({
  swatches,
  className,
  size = "sm",
  showLabels = false,
}: SwatchRowProps) {
  const dim = size === "sm" ? "h-3 w-6" : "h-4 w-8";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {swatches.map((s) => (
        <div key={s.hex + s.name} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(dim, "ring-char-ink/10 inline-block rounded-[2px] ring-1")}
            style={{ backgroundColor: s.hex }}
          />
          {showLabels ? (
            <span className="text-char-ink/70 font-mono text-[10px] uppercase tracking-wider">
              {s.name}
            </span>
          ) : null}
          <span className="sr-only">{s.name}</span>
        </div>
      ))}
    </div>
  );
}
