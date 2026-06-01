import Link from "next/link";
import { getFeaturedProjects } from "@/lib/mdx";
import { ProjectTile } from "./ProjectTile";
import { ScribbleArrow } from "@/components/motion/ScribbleArrow";
import { StitchHeading } from "@/components/quirk/StitchHeading";

/**
 * Asymmetric featured projects grid:
 *  - 1 item: full-width single tile
 *  - 2 items: side-by-side
 *  - 3+ items: one large + two stacked (only first three shown)
 *
 * Data sourced from MDX files with `featured: true`, sorted by date desc.
 */
export async function FeaturedProjects() {
  const projects = await getFeaturedProjects(3);
  if (projects.length === 0) return null;

  const [first, ...rest] = projects;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
      <header className="mb-12 flex items-end justify-between gap-6">
        <div>
          <p className="font-accent text-rose-madder text-2xl">selected work</p>
          <StitchHeading className="mt-2">Recent projects</StitchHeading>
        </div>
        <Link
          href="/projects"
          className="text-ink-indigo hover:text-marigold-deep group hidden items-center gap-2 text-sm font-medium transition-colors sm:inline-flex"
        >
          All projects
          <ScribbleArrow className="h-3 w-8 transition-transform group-hover:translate-x-1" />
        </Link>
      </header>

      {projects.length >= 3 ? (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <ProjectTile project={first} variant="large" />
          <div className="flex flex-col gap-10">
            {rest.slice(0, 2).map((p) => (
              <ProjectTile key={p.slug} project={p} variant="small" />
            ))}
          </div>
        </div>
      ) : projects.length === 2 ? (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectTile key={p.slug} project={p} variant="small" />
          ))}
        </div>
      ) : (
        <ProjectTile project={first} variant="large" />
      )}

      <Link
        href="/projects"
        className="text-ink-indigo hover:text-marigold-deep group mt-10 inline-flex items-center gap-2 text-sm font-medium transition-colors sm:hidden"
      >
        All projects
        <ScribbleArrow className="h-3 w-8" />
      </Link>
    </section>
  );
}
