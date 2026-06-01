import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProjects } from "@/lib/mdx";
import { ProjectsBrowser } from "@/components/projects/ProjectsBrowser";
import { COPY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects, capsules, and textile collaborations.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
      <header className="mb-14">
        <p className="font-accent text-rose-madder text-2xl">
          {COPY.projectsPage.eyebrow}
        </p>
        <h1 className="font-display text-ink-indigo mt-2 text-5xl tracking-tight italic sm:text-6xl">
          {COPY.projectsPage.heading}
        </h1>
        <p className="text-char-ink/70 mt-6 max-w-xl text-lg">
          {COPY.projectsPage.intro}
        </p>
      </header>

      <Suspense fallback={null}>
        <ProjectsBrowser projects={projects} />
      </Suspense>
    </main>
  );
}
