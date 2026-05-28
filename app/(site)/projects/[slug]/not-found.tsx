import Link from "next/link";
import { ScribbleArrow } from "@/components/motion/ScribbleArrow";

export default function ProjectNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start px-6 py-24 sm:px-10">
      <p className="font-accent text-rose-madder text-2xl">404</p>
      <h1 className="font-display text-ink-indigo mt-2 text-5xl tracking-tight italic">
        That project came loose.
      </h1>
      <p className="text-char-ink/75 mt-6 max-w-lg text-lg">
        The case study you tried to open isn&rsquo;t here. Could be moved,
        could still be in the studio.
      </p>
      <Link
        href="/projects"
        className="text-ink-indigo hover:text-marigold-deep group mt-10 inline-flex items-center gap-2 font-medium transition-colors"
      >
        Back to projects
        <ScribbleArrow className="h-3 w-9 transition-transform group-hover:translate-x-1" />
      </Link>
    </main>
  );
}
