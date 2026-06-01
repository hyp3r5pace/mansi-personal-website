"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LooseThread } from "@/components/quirk/LooseThread";
import { ScribbleArrow } from "@/components/motion/ScribbleArrow";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start px-6 py-24 sm:px-10">
      <LooseThread className="w-72 sm:w-96" />
      <p className="font-accent text-rose-madder mt-10 text-2xl">500</p>
      <h1 className="font-display text-ink-indigo mt-2 text-5xl tracking-tight italic sm:text-6xl">
        A stitch dropped.
      </h1>
      <p className="text-char-ink/75 mt-6 max-w-lg text-lg">
        Something on the studio side went wrong. Try again — most of the time
        it&rsquo;s the page, not you.
      </p>
      {error.digest ? (
        <p className="text-char-ink/45 mt-4 font-mono text-xs">
          ref: {error.digest}
        </p>
      ) : null}
      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
        <button
          type="button"
          onClick={() => reset()}
          className="bg-ink-indigo text-paper hover:bg-marigold-deep cursor-pointer rounded-sm px-6 py-3 font-medium transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-ink-indigo hover:text-marigold-deep group inline-flex items-center gap-2 font-medium self-center transition-colors"
        >
          Back to the studio
          <ScribbleArrow className="h-3 w-9 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </main>
  );
}
