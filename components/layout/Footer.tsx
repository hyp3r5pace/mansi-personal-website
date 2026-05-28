import Link from "next/link";
import { BackToTop } from "./BackToTop";

const SOCIALS = [
  { href: "https://instagram.com/", label: "Instagram" },
  { href: "https://behance.net/", label: "Behance" },
  { href: "https://linkedin.com/", label: "LinkedIn" },
  { href: "mailto:hello@example.com", label: "Email" },
] as const;

export function Footer() {
  return (
    <footer className="bg-indigo-deep text-paper/85 relative mt-24">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-accent text-saffron text-2xl">let&rsquo;s make something</p>
            <Link
              href="/contact"
              className="font-display mt-2 inline-block text-3xl tracking-tight text-paper italic hover:text-marigold transition-colors sm:text-4xl"
            >
              hello@example.com
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
            © {new Date().getFullYear()} Bubu. Drawn, dyed, and stitched in India.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
