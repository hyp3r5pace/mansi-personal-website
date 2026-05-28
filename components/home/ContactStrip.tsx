import Link from "next/link";
import { JaliReveal } from "@/components/motion/JaliReveal";

export function ContactStrip() {
  return (
    <section className="bg-indigo-deep text-paper relative overflow-hidden">
      <JaliReveal
        className="inset-y-0 left-0 w-1/2"
        tintClassName="text-marigold"
        opacity={0.18}
        fadeFrom="left"
        size={96}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-20 sm:px-10 md:flex-row md:items-end md:justify-between">
        <div className="relative">
          <p className="font-accent text-saffron text-2xl">say hello</p>
          <h2 className="font-display mt-2 max-w-2xl text-4xl leading-[1.05] tracking-tight italic sm:text-5xl">
            Let&rsquo;s make something — together, slowly.
          </h2>
        </div>
        <div className="relative flex flex-wrap items-center gap-6">
          <Link
            href="/contact"
            className="bg-marigold text-ink-indigo hover:bg-saffron inline-flex h-12 items-center rounded-full px-6 font-medium transition-colors"
          >
            Write to me
          </Link>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-marigold text-paper/85 font-medium transition-colors"
          >
            On Instagram →
          </a>
        </div>
      </div>
    </section>
  );
}
