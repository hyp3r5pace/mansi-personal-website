import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProjects } from "@/lib/mdx";
import { ProjectsBrowser } from "@/components/projects/ProjectsBrowser";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects, capsules, and textile collaborations.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
      <header className="mb-14">
        <p className="font-accent text-rose-madder text-2xl">the work</p>
        <h1 className="font-display text-ink-indigo mt-2 text-5xl tracking-tight italic sm:text-6xl">
          Projects
        </h1>
        <p className="text-char-ink/70 mt-6 max-w-xl text-lg">
          Selected projects, capsules, and textile collaborations. Filter by
          category or year.
        </p>
      </header>

      <Suspense fallback={null}>
        <ProjectsBrowser projects={projects} />
      </Suspense>
    </main>
  );
}
