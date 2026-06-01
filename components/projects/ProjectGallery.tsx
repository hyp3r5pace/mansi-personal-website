"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { LookbookItem } from "@/lib/mdx";
import { cn } from "@/lib/cn";

type ProjectGalleryProps = {
  images: LookbookItem[];
};

type Block =
  | { kind: "full"; items: [LookbookItem] }
  | { kind: "contained"; items: [LookbookItem] }
  | { kind: "pair"; items: [LookbookItem, LookbookItem] };

const ratio = (i: LookbookItem) => i.width / i.height;

/**
 * Arrange a flat image list into a rhythm of full-bleed banners, contained
 * singles, and side-by-side pairs. Decisions are driven by each image's
 * aspect ratio unless its `layout` is set explicitly:
 *   - very wide (>= 2.2)        -> full-bleed banner
 *   - portrait (ratio < 0.85)   -> paired with the next portrait if possible
 *   - everything else           -> contained single
 */
function arrange(images: LookbookItem[]): Block[] {
  const blocks: Block[] = [];
  for (let i = 0; i < images.length; i += 1) {
    const img = images[i];
    if (img.layout === "full") {
      blocks.push({ kind: "full", items: [img] });
      continue;
    }
    if (img.layout === "contained") {
      blocks.push({ kind: "contained", items: [img] });
      continue;
    }
    const next = images[i + 1];
    const wantsPair =
      img.layout === "pair" ||
      (img.layout === undefined && ratio(img) < 0.85);
    const nextPairs =
      next &&
      (next.layout === "pair" ||
        (next.layout === undefined && ratio(next) < 0.85));
    if (wantsPair && nextPairs) {
      blocks.push({ kind: "pair", items: [img, next] });
      i += 1;
      continue;
    }
    if (img.layout === undefined && ratio(img) >= 2.2) {
      blocks.push({ kind: "full", items: [img] });
      continue;
    }
    blocks.push({ kind: "contained", items: [img] });
  }
  return blocks;
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const [open, setOpen] = useState<number | null>(null);
  const blocks = arrange(images);

  // index() maps an image back to its position in the flat list for the
  // lightbox, so navigation runs across every image regardless of block.
  const indexOf = (img: LookbookItem) => images.indexOf(img);

  return (
    <section className="flex flex-col gap-6 sm:gap-10">
      {blocks.map((block, bi) => {
        if (block.kind === "full") {
          const img = block.items[0];
          return (
            <GalleryImage
              key={bi}
              img={img}
              sizes="100vw"
              onOpen={() => setOpen(indexOf(img))}
              className="relative left-1/2 w-screen -translate-x-1/2"
            />
          );
        }
        if (block.kind === "pair") {
          return (
            <div
              key={bi}
              className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 sm:px-10"
            >
              {block.items.map((img) => (
                <GalleryImage
                  key={img.src}
                  img={img}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  onOpen={() => setOpen(indexOf(img))}
                />
              ))}
            </div>
          );
        }
        const img = block.items[0];
        return (
          <div key={bi} className="mx-auto w-full max-w-5xl px-6 sm:px-10">
            <GalleryImage
              img={img}
              sizes="(min-width: 1024px) 1024px, 100vw"
              onOpen={() => setOpen(indexOf(img))}
            />
          </div>
        );
      })}

      {open !== null ? (
        <Lightbox
          images={images}
          index={open}
          onClose={() => setOpen(null)}
          onIndex={setOpen}
        />
      ) : null}
    </section>
  );
}

function GalleryImage({
  img,
  sizes,
  onOpen,
  className,
}: {
  img: LookbookItem;
  sizes: string;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <figure className={className}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open image: ${img.alt}`}
        className="ring-char-ink/10 hover:ring-marigold-deep/60 focus-visible:ring-marigold-deep group block w-full cursor-zoom-in overflow-hidden ring-1 transition-[box-shadow] focus-visible:ring-2 focus-visible:outline-none"
      >
        <Image
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes={sizes}
          quality={90}
          className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.015]"
        />
      </button>
      {img.caption ? (
        <figcaption className="text-char-ink/55 mx-auto mt-2 max-w-5xl px-6 font-mono text-[10px] uppercase tracking-widest sm:px-10">
          {img.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: LookbookItem[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const img = images[index];
  const prev = useCallback(
    () => onIndex((index - 1 + images.length) % images.length),
    [index, images.length, onIndex],
  );
  const next = useCallback(
    () => onIndex((index + 1) % images.length),
    [index, images.length, onIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  // Swipe handling for touch.
  const [startX, setStartX] = useState<number | null>(null);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${images.length}: ${img.alt}`}
      className="bg-ink-indigo/95 fixed inset-0 z-50 flex flex-col"
      onClick={onClose}
      onTouchStart={(e) => setStartX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (dx > 50) prev();
        else if (dx < -50) next();
        setStartX(null);
      }}
    >
      <div className="text-paper/70 flex items-center justify-between px-6 py-4 font-mono text-[11px] uppercase tracking-widest">
        <span>
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="hover:text-marigold flex h-9 w-9 items-center justify-center rounded-full transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-6 sm:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <NavButton side="left" onClick={prev} />
        <Image
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes="100vw"
          quality={90}
          className="max-h-full w-auto max-w-full object-contain"
          priority
        />
        <NavButton side="right" onClick={next} />
      </div>

      {img.caption ? (
        <p
          className="text-paper/75 px-6 pb-6 text-center text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {img.caption}
        </p>
      ) : null}
    </div>
  );
}

function NavButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous image" : "Next image"}
      className={cn(
        "text-paper/80 hover:bg-paper/10 hover:text-paper absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition-colors sm:flex",
        side === "left" ? "left-2" : "right-2",
      )}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {side === "left" ? <path d="M14 4 L7 11 L14 18" /> : <path d="M8 4 L15 11 L8 18" />}
      </svg>
    </button>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
      <path d="M5 5 L17 17" />
      <path d="M17 5 L5 17" />
    </svg>
  );
}
