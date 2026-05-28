import Link from "next/link";
import { EditorialPlaceholder } from "@/components/home/EditorialPlaceholder";
import { ScribbleArrow } from "@/components/motion/ScribbleArrow";
import type { Project } from "@/lib/mdx";

/**
 * "Next project" card. Always paired with the case study so a visitor
 * always has somewhere editorial to land next.
 */
export function NextProject({ next }: { next: Project }) {
  return (
    <section className="bg-paper-deep paper-grain">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
        <Link
          href={`/projects/${next.slug}`}
          className="group grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16"
        >
          <div className="order-2 lg:order-1">
            <p className="font-accent text-rose-madder text-2xl">next</p>
            <h2 className="font-display text-ink-indigo mt-2 text-4xl tracking-tight italic sm:text-5xl">
              <span className="bg-marigold bg-no-repeat bg-[length:0%_3px] bg-[position:0_100%] pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_3px]">
                {next.title}
              </span>
            </h2>
            <p className="text-char-ink/70 mt-4 max-w-md">
              {next.excerpt}
            </p>
            <p className="text-ink-indigo group-hover:text-marigold-deep mt-6 inline-flex items-center gap-2 font-medium transition-colors">
              Read the case study
              <ScribbleArrow className="h-3 w-9 transition-transform group-hover:translate-x-1" />
            </p>
          </div>
          <EditorialPlaceholder
            className="order-1 lg:order-2"
            title={next.title}
            palette={next.palette}
            category={next.category}
            year={next.year}
            ratio="landscape"
          />
        </Link>
      </div>
    </section>
  );
}
