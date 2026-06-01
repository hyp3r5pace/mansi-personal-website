import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { EditorialPlaceholder } from "./EditorialPlaceholder";
import { SwatchRow } from "@/components/content/SwatchRow";
import type { Project } from "@/lib/mdx";

const TILE_RATIO = { portrait: "aspect-[3/4]", landscape: "aspect-[4/3]" } as const;

type ProjectTileProps = {
  project: Project;
  variant?: "large" | "small";
  className?: string;
};

/**
 * Featured project tile. Cover + title + palette swatch row.
 * Hover: lifts slightly, marigold underline animates under title,
 * swatch row gains a faint scale.
 */
export function ProjectTile({ project, variant = "small", className }: ProjectTileProps) {
  const isLarge = variant === "large";
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group relative flex flex-col gap-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1",
        className,
      )}
    >
      {project.coverImage ? (
        <div
          className={cn(
            "ring-char-ink/15 group-hover:ring-marigold-deep relative w-full overflow-hidden rounded-sm ring-1 transition-[box-shadow,_ring] duration-500 group-hover:ring-2",
            isLarge ? TILE_RATIO.portrait : TILE_RATIO.landscape,
          )}
        >
          <Image
            src={project.coverImage.src}
            alt={project.title}
            fill
            sizes={isLarge ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 45vw, 100vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <EditorialPlaceholder
          title={project.title}
          palette={project.palette}
          category={project.category}
          year={project.year}
          ratio={isLarge ? "portrait" : "landscape"}
          className="ring-char-ink/15 group-hover:ring-marigold-deep transition-[box-shadow,_ring] duration-500 group-hover:ring-2"
        />
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-char-ink/60 font-mono text-[11px] uppercase tracking-widest">
            {project.category} · {project.year}
          </p>
          <h3
            className={cn(
              "font-display text-ink-indigo mt-1 tracking-tight italic",
              isLarge ? "text-3xl sm:text-4xl" : "text-2xl",
            )}
          >
            <span className="bg-marigold bg-no-repeat bg-[length:0%_2px] bg-[position:0_100%] pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
              {project.title}
            </span>
          </h3>
        </div>
        <SwatchRow
          swatches={project.palette.slice(0, 4)}
          className="mt-2 shrink-0 transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </Link>
  );
}
