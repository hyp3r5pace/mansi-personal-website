"use client";

import { ScribbleArrow } from "@/components/motion/ScribbleArrow";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        const reduced =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }}
      className="text-paper/80 hover:text-marigold inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-widest transition-colors sm:self-auto"
    >
      <ScribbleArrow direction="up" className="h-3 w-8" />
      Back to top
    </button>
  );
}
