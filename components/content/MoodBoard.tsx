import Image from "next/image";
import { cn } from "@/lib/cn";
import { EditorialPlaceholder } from "@/components/home/EditorialPlaceholder";
import type { Swatch } from "./SwatchRow";

type MoodBoardImage = {
  src?: string;
  alt: string;
  caption?: string;
  /** Used to render a stand-in placeholder when src is absent. */
  palette?: Swatch[];
  label?: string;
};

type MoodBoardProps = {
  images: MoodBoardImage[];
  className?: string;
};

/**
 * Free-form mood board grid. 4–6 entries look best.
 * If an entry has no `src`, renders an EditorialPlaceholder built
 * from its palette — useful while real photography is still pending.
 */
export function MoodBoard({ images, className }: MoodBoardProps) {
  return (
    <figure className={cn("my-12", className)}>
      <div className="grid grid-cols-6 gap-3 sm:gap-4">
        {images.map((img, i) => {
          const span = SPAN_PATTERN[i % SPAN_PATTERN.length];
          return (
            <div
              key={(img.src ?? img.label ?? "img") + i}
              className={cn(
                "ring-char-ink/10 paper-grain bg-paper-deep relative overflow-hidden rounded-sm ring-1",
                span,
              )}
            >
              {img.src ? (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <EditorialPlaceholder
                  title={img.label ?? img.alt}
                  palette={img.palette}
                  ratio={span.includes("aspect-square") ? "square" : span.includes("aspect-[3/4]") ? "portrait" : "landscape"}
                  className="absolute inset-0 h-full w-full ring-0"
                />
              )}
            </div>
          );
        })}
      </div>
    </figure>
  );
}

const SPAN_PATTERN = [
  "col-span-3 row-span-2 aspect-[3/4]",
  "col-span-3 aspect-[4/3]",
  "col-span-2 aspect-square",
  "col-span-2 aspect-[3/4]",
  "col-span-2 aspect-[4/3]",
  "col-span-3 aspect-square",
];
