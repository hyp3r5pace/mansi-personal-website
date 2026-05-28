import Link from "next/link";
import { cn } from "@/lib/cn";
import { EditorialPlaceholder } from "@/components/home/EditorialPlaceholder";
import { SwatchRow } from "@/components/content/SwatchRow";
import type { Project } from "@/lib/mdx";

type ProjectsGridProps = {
  projects: Project[];
  className?: string;
};

/**
 * CSS-columns masonry. Three columns on desktop, two on tablet, one
 * on mobile. Items break-inside-avoid so a tile never splits across
 * columns. Mixed aspect ratios produce the editorial unevenness.
 */
export function ProjectsGrid({ projects, className }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-char-ink/60 stitch-border bg-paper-deep my-12 flex items-center justify-center p-12 text-center text-sm">
        <p className="font-display text-xl italic">
          Nothing here under that filter — try another.
        </p>
      </div>
    );
  }

  return (
    <ul
      className={cn(
        "[column-fill:_balance] columns-1 gap-8 sm:columns-2 lg:columns-3 lg:gap-10",
        className,
      )}
    >
      {projects.map((project, i) => {
        // Rotate aspect ratios to give the masonry visual rhythm
        const ratio = (["portrait", "square", "landscape"] as const)[i % 3];
        return (
          <li key={project.slug} className="mb-8 break-inside-avoid lg:mb-10">
            <Link
              href={`/projects/${project.slug}`}
              className="group block"
            >
              <EditorialPlaceholder
                title={project.title}
                palette={project.palette}
                category={project.category}
                year={project.year}
                ratio={ratio}
                className="ring-char-ink/15 group-hover:ring-marigold-deep transition-[box-shadow,_ring,_transform] duration-500 group-hover:-translate-y-1 group-hover:ring-2"
              />
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-char-ink/60 font-mono text-[10px] uppercase tracking-widest">
                    {project.category} · {project.year}
                  </p>
                  <h3 className="font-display text-ink-indigo mt-1 text-xl tracking-tight italic">
                    <span className="bg-marigold bg-no-repeat bg-[length:0%_2px] bg-[position:0_100%] pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                      {project.title}
                    </span>
                  </h3>
                </div>
                <SwatchRow swatches={project.palette.slice(0, 3)} className="mt-2 shrink-0" />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
