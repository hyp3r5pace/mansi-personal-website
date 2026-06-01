import Link from "next/link";
import { HeroBorder } from "./HeroBorder";
import { EditorialPlaceholder } from "./EditorialPlaceholder";
import { JaliReveal } from "@/components/motion/JaliReveal";
import { ScribbleArrow } from "@/components/motion/ScribbleArrow";
import { SITE, COPY } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <JaliReveal
        className="inset-y-0 right-0 w-2/3 sm:w-1/2"
        tintClassName="text-ink-indigo"
        opacity={0.14}
        fadeFrom="right"
        size={88}
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 sm:px-10 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-32">
        <div className="relative">
          <p className="font-accent text-rose-madder text-2xl">
            {SITE.location.eyebrow}
          </p>
          <h1 className="font-display text-ink-indigo mt-3 text-6xl leading-[0.95] tracking-tight italic sm:text-7xl lg:text-8xl">
            {SITE.wordmark}
          </h1>
          <p className="text-char-ink/80 mt-8 max-w-md text-lg sm:text-xl">
            {SITE.tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/projects"
              className="bg-marigold text-ink-indigo hover:bg-marigold-deep group inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium transition-colors"
            >
              {COPY.hero.ctaPrimary}
              <ScribbleArrow className="h-3 w-7 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="text-ink-indigo hover:text-marigold-deep inline-flex h-12 items-center font-medium transition-colors"
            >
              {COPY.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="text-ink-indigo relative p-6 sm:p-7">
            <HeroBorder />
            <EditorialPlaceholder
              title={COPY.hero.imageTitle}
              category="Studio"
              year={2026}
              palette={[
                { name: "indigo", hex: "#1F2A56" },
                { name: "madder", hex: "#B5495B" },
                { name: "marigold", hex: "#E8A33D" },
                { name: "paper", hex: "#F6EFE2" },
              ]}
              ratio="portrait"
            />
          </div>
          <p className="font-accent text-rose-madder mt-3 text-xl">
            {COPY.hero.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
