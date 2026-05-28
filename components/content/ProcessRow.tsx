import Image from "next/image";
import { cn } from "@/lib/cn";
import { EditorialPlaceholder } from "@/components/home/EditorialPlaceholder";
import type { Swatch } from "./SwatchRow";

type ProcessRowProps = {
  children: React.ReactNode;
  image?: { src?: string; alt: string; palette?: Swatch[]; label?: string };
  /** "right" places image on the right (default); alternate in MDX for rhythm. */
  align?: "left" | "right";
  caption?: string;
  className?: string;
};

/**
 * Alternating text-and-image row for the process section of a case study.
 * If image.src is missing, renders an EditorialPlaceholder so the
 * layout still has rhythm before real photography lands.
 */
export function ProcessRow({ children, image, align = "right", caption, className }: ProcessRowProps) {
  return (
    <div
      className={cn(
        "my-12 grid grid-cols-1 items-center gap-8 sm:my-16 md:grid-cols-2 md:gap-14",
        align === "left" && "md:[&>*:first-child]:order-2",
        className,
      )}
    >
      <figure>
        <div className="ring-char-ink/10 bg-paper-deep paper-grain relative aspect-[4/3] w-full overflow-hidden rounded-sm ring-1">
          {image?.src ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <EditorialPlaceholder
              title={image?.label ?? image?.alt ?? "Process"}
              palette={image?.palette}
              ratio="landscape"
              className="absolute inset-0 h-full w-full ring-0"
            />
          )}
        </div>
        {caption ? (
          <figcaption className="font-accent text-rose-madder mt-2 text-lg">{caption}</figcaption>
        ) : null}
      </figure>
      <div className="prose-content text-char-ink/85 max-w-prose space-y-4 text-base leading-relaxed sm:text-lg">
        {children}
      </div>
    </div>
  );
}
