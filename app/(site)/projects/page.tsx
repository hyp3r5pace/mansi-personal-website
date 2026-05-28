import type { Metadata } from "next";
import { ScribbleArrow } from "@/components/motion/ScribbleArrow";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-20 sm:px-10">
      <p className="font-accent text-rose-madder text-2xl">the work</p>
      <h1 className="font-display text-ink-indigo mt-2 text-5xl tracking-tight italic sm:text-6xl">
        Projects
      </h1>
      <p className="text-char-ink/70 mt-6 max-w-xl">
        Index of finished pieces, capsules, and collaborations. Filters by
        category and year. <em>Coming in Phase 3.</em>
      </p>
      <p className="text-char-ink/50 mt-12 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
        <ScribbleArrow className="h-3 w-10" />
        next phase
      </p>
    </main>
  );
}
