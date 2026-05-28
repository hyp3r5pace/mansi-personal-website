import type { Metadata } from "next";
import { ScribbleArrow } from "@/components/motion/ScribbleArrow";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-20 sm:px-10">
      <p className="font-accent text-rose-madder text-2xl">about me</p>
      <h1 className="font-display text-ink-indigo mt-2 text-5xl tracking-tight italic sm:text-6xl">
        The maker
      </h1>
      <p className="text-char-ink/70 mt-6 max-w-xl">
        Portrait, bio, and a stitched timeline of work. <em>Coming in Phase 5.</em>
      </p>
      <p className="text-char-ink/50 mt-12 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
        <ScribbleArrow className="h-3 w-10" />
        next phase
      </p>
    </main>
  );
}
