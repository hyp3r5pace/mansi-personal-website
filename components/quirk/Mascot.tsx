"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Studio mascot — a small stylised peacock that idles in the bottom-right
 * corner. Wing flicks gently on a long loop; clicking gives it a quick
 * bow. Hidden under md and when the user prefers reduced motion (the
 * peacock relies on its movement for charm; a static one is just a sticker).
 */
export function Mascot() {
  const reduced = useReducedMotion();
  const [reacting, setReacting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Defer mount so it doesn't compete with first paint.
    const t = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  if (reduced || !visible) return null;

  return (
    <motion.button
      type="button"
      onClick={() => {
        setReacting(true);
        window.setTimeout(() => setReacting(false), 700);
      }}
      aria-label="Say hi to the studio peacock"
      className="group fixed right-4 bottom-4 z-30 hidden cursor-pointer rounded-full p-2 focus-visible:outline-2 focus-visible:outline-marigold-deep md:block"
      initial={{ opacity: 0, y: 18, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={
          reacting
            ? { rotate: [-2, -14, -4, 0], y: [0, -6, 0, 0] }
            : { rotate: [0, -1.5, 0, 1.5, 0] }
        }
        transition={
          reacting
            ? { duration: 0.7, ease: "easeOut" }
            : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ transformOrigin: "70% 80%" }}
      >
        <PeacockSvg reacting={reacting} />
      </motion.div>
      <span className="bg-paper-deep border-char-ink/15 text-ink-indigo font-display absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-sm border px-3 py-1 text-sm italic shadow-sm group-hover:block">
        thanks for visiting.
      </span>
    </motion.button>
  );
}

function PeacockSvg({ reacting }: { reacting: boolean }) {
  return (
    <svg
      viewBox="0 0 100 110"
      width="64"
      height="72"
      role="img"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ink-indigo"
    >
      {/* Tail fan — three feathers radiating */}
      <g className="text-indigo-soft">
        <path d="M50 70 C 20 55, 10 30, 22 12" />
        <path d="M50 70 C 50 40, 50 22, 50 8" />
        <path d="M50 70 C 80 55, 90 30, 78 12" />
        {/* Feather "eyes" */}
        <circle cx="22" cy="12" r="3.2" className="text-marigold-deep fill-marigold" />
        <circle cx="50" cy="8" r="3.6" className="text-marigold-deep fill-marigold" />
        <circle cx="78" cy="12" r="3.2" className="text-marigold-deep fill-marigold" />
        <circle cx="22" cy="12" r="1.2" className="text-ink-indigo fill-ink-indigo" />
        <circle cx="50" cy="8" r="1.4" className="text-ink-indigo fill-ink-indigo" />
        <circle cx="78" cy="12" r="1.2" className="text-ink-indigo fill-ink-indigo" />
      </g>

      {/* Body */}
      <path
        d="M50 70 C 44 80, 44 92, 52 96 C 60 100, 64 92, 60 84 Z"
        className="text-ink-indigo fill-indigo-soft"
        strokeWidth="1.4"
      />

      {/* Head */}
      <circle cx="58" cy="62" r="6" className="text-ink-indigo fill-ink-indigo" />

      {/* Beak */}
      <path d="M64 62 L70 60 L64 64 Z" className="text-marigold-deep fill-marigold" />

      {/* Eye */}
      <circle cx="59" cy="60" r="0.9" className="text-paper fill-paper" />

      {/* Crown plumes */}
      <path d="M58 56 L57 50" />
      <path d="M60 56 L61 50" />
      <path d="M59 55 L59 49" />
      <circle cx="57" cy="50" r="0.8" className="text-marigold-deep fill-marigold" />
      <circle cx="61" cy="50" r="0.8" className="text-marigold-deep fill-marigold" />
      <circle cx="59" cy="49" r="0.8" className="text-marigold-deep fill-marigold" />

      {/* Feet */}
      <path d="M52 96 L50 104" />
      <path d="M58 96 L60 104" />

      {/* Reaction sparkle */}
      {reacting ? (
        <g className="text-marigold-deep">
          <path d="M76 50 L80 46 M76 50 L72 46 M76 50 L80 54 M76 50 L72 54" strokeWidth="1" />
        </g>
      ) : null}
    </svg>
  );
}
