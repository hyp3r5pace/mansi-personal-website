import Image from "next/image";
import Link from "next/link";
import { ScribbleArrow } from "@/components/motion/ScribbleArrow";
import { StitchBorder } from "@/components/motion/StitchBorder";
import { COPY } from "@/lib/site";

export function AboutTeaser() {
  return (
    <section className="bg-paper-deep paper-grain">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-24 sm:px-10 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <div className="text-ink-indigo relative">
          <StitchBorder
            color="var(--color-ink-indigo)"
            weight={1.25}
            dashLength={5}
            gapLength={4}
            radius={3}
            className="p-3"
          >
            <Image
              src="/home/home_bottom_page.jpg"
              alt="Mansi Pandey draping a linen garment on a dress form in the studio"
              width={960}
              height={1280}
              quality={90}
              sizes="(min-width: 768px) 38vw, 100vw"
              className="h-auto w-full object-cover"
            />
          </StitchBorder>
        </div>

        <div>
          <p className="font-accent text-rose-madder text-2xl">
            {COPY.aboutTeaser.eyebrow}
          </p>
          <h2 className="font-display text-ink-indigo mt-2 text-4xl tracking-tight italic sm:text-5xl">
            {COPY.aboutTeaser.heading}
          </h2>
          <p className="text-char-ink/80 mt-6 max-w-lg text-lg leading-relaxed">
            {COPY.aboutTeaser.body}
          </p>
          <Link
            href="/about"
            className="text-ink-indigo hover:text-marigold-deep group mt-8 inline-flex items-center gap-2 text-base font-medium transition-colors"
          >
            {COPY.aboutTeaser.link}
            <ScribbleArrow className="h-3 w-9 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
