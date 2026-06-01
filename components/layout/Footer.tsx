import Link from "next/link";
import { BackToTop } from "./BackToTop";
import { ScribbleArrow } from "@/components/motion/ScribbleArrow";
import { SITE, COPY } from "@/lib/site";

const SOCIALS = SITE.socials.map((s) => ({ href: s.href, label: s.label }));

export function Footer() {
  return (
    <footer className="bg-indigo-deep text-paper/85 relative mt-24">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-accent text-saffron text-2xl">{COPY.footer.eyebrow}</p>
            <p className="text-paper/70 mt-3 text-sm">{COPY.footer.prompt}</p>
            <Link
              href="/contact"
              className="group font-display mt-1 inline-flex items-center gap-3 text-3xl tracking-tight text-paper italic transition-colors hover:text-marigold sm:text-4xl"
            >
              {COPY.footer.cta}
              <ScribbleArrow className="h-3 w-10 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="hover:text-marigold transition-colors"
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-paper/15 mt-12 flex flex-col gap-4 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="opacity-70">
            © {new Date().getFullYear()} {SITE.author}. {SITE.copyrightLine}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/rss.xml"
              className="opacity-70 hover:text-marigold hover:opacity-100 transition-colors"
            >
              RSS
            </a>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
