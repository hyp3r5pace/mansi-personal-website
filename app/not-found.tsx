import Link from "next/link";
import { LooseThread } from "@/components/quirk/LooseThread";
import { ScribbleArrow } from "@/components/motion/ScribbleArrow";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start px-6 py-24 sm:px-10">
      <LooseThread className="w-72 sm:w-96" />
      <p className="font-accent text-rose-madder mt-10 text-2xl">404</p>
      <h1 className="font-display text-ink-indigo mt-2 text-5xl tracking-tight italic sm:text-6xl">
        That thread came loose.
      </h1>
      <p className="text-char-ink/75 mt-6 max-w-lg text-lg">
        The page you tried to open isn&rsquo;t here. It may have moved, or it
        may never have been stitched in.
      </p>
      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
        <Link
          href="/"
          className="text-ink-indigo hover:text-marigold-deep group inline-flex items-center gap-2 font-medium transition-colors"
        >
          Back to the studio
          <ScribbleArrow className="h-3 w-9 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/projects"
          className="text-char-ink/65 hover:text-marigold-deep font-mono text-xs uppercase tracking-widest transition-colors self-center"
        >
          Projects
        </Link>
        <Link
          href="/blog"
          className="text-char-ink/65 hover:text-marigold-deep font-mono text-xs uppercase tracking-widest transition-colors self-center"
        >
          Journal
        </Link>
      </div>
    </main>
  );
}
