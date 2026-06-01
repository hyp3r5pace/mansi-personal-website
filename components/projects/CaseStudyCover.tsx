import Image from "next/image";
import { JaliReveal } from "@/components/motion/JaliReveal";
import { EditorialPlaceholder } from "@/components/home/EditorialPlaceholder";
import type { Project } from "@/lib/mdx";

/**
 * Full-bleed cover for a case study. Uses the project's real cover photo
 * when one is provided, otherwise an editorial palette placeholder. A serif
 * title sits in a band along the bottom; jali bleeds in from the right to
 * add texture without crowding the title.
 */
export function CaseStudyCover({ project }: { project: Project }) {
  return (
    <section className="relative">
      <div className="ring-char-ink/10 relative aspect-[16/9] w-full overflow-hidden ring-1 sm:aspect-[21/9]">
        {project.coverImage ? (
          <Image
            src={project.coverImage.src}
            alt={project.title}
            fill
            sizes="100vw"
            quality={90}
            priority
            className="object-cover"
          />
        ) : (
          <EditorialPlaceholder
            title=""
            palette={project.palette}
            ratio="landscape"
            className="ring-0"
          />
        )}
        <JaliReveal
          className="inset-y-0 right-0 w-1/3"
          tintClassName="text-paper"
          opacity={0.16}
          fadeFrom="right"
          size={96}
        />
        <div className="from-ink-indigo/85 via-ink-indigo/30 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="text-paper absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-10 sm:px-10 sm:py-14">
          <p className="font-mono text-[11px] uppercase tracking-widest opacity-80">
            {project.category} · {project.year}
          </p>
          <h1 className="font-display text-4xl leading-[1.02] tracking-tight italic sm:text-6xl lg:text-7xl">
            {project.title}
          </h1>
          {project.excerpt ? (
            <p className="mt-2 max-w-2xl text-base opacity-85 sm:text-lg">{project.excerpt}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
