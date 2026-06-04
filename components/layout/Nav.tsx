"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { SITE, FEATURES } from "@/lib/site";
import { JaliReveal } from "@/components/motion/JaliReveal";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

// Hide blog-gated links when the feature is off.
const VISIBLE_LINKS = NAV_LINKS.filter(
  (l) => FEATURES.blog || l.href !== "/blog",
);

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Close mobile menu on route change. Pathname is an external value
    // synchronized via the App Router, so a setState here is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-sm">
        <div className="bg-paper/85 border-char-ink/8 border-b">
          <nav
            aria-label="Primary"
            className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-10"
          >
            <Link
              href="/"
              className="font-accent text-ink-indigo text-3xl font-semibold leading-none"
            >
              {SITE.wordmark}
            </Link>

            <ul className="hidden items-center gap-8 md:flex">
              {VISIBLE_LINKS.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        "relative inline-flex items-center text-sm font-medium transition-colors",
                        active ? "text-ink-indigo" : "text-char-ink/70 hover:text-ink-indigo",
                      )}
                    >
                      {l.label}
                      {active && (
                        <motion.span
                          layoutId="nav-underline"
                          className="bg-marigold absolute -bottom-1.5 left-0 right-0 h-[2px]"
                          transition={
                            reduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }
                          }
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="text-ink-indigo hover:bg-paper-deep flex h-10 w-10 items-center justify-center rounded-full transition-colors md:hidden"
            >
              <HamburgerIcon open={open} />
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="bg-paper fixed inset-0 z-50 flex flex-col md:hidden"
          >
            <JaliReveal
              className="inset-0"
              tintClassName="text-ink-indigo"
              opacity={0.22}
              fadeFrom="top"
              size={96}
            />
            <div className="relative flex h-16 items-center justify-between px-6">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="font-accent text-ink-indigo text-3xl font-semibold leading-none"
              >
                {SITE.wordmark}
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="text-ink-indigo hover:bg-paper-deep flex h-10 w-10 items-center justify-center rounded-full transition-colors"
              >
                <HamburgerIcon open />
              </button>
            </div>
            <ul className="relative mt-12 flex flex-col items-center gap-6 px-6">
              {VISIBLE_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.05 + i * 0.04 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "font-display text-4xl tracking-tight italic transition-colors",
                      isActive(l.href)
                        ? "text-marigold-deep"
                        : "text-ink-indigo hover:text-marigold-deep",
                    )}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M5 5 L17 17" />
          <path d="M17 5 L5 17" />
        </>
      ) : (
        <>
          <path d="M3 7 H19" />
          <path d="M3 15 H19" />
        </>
      )}
    </svg>
  );
}
