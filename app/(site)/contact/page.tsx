import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about commissions, collaborations, or studio visits.",
};

const SOCIALS = [
  { label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" },
  { label: "Instagram", value: "@bubu.studio", href: "https://instagram.com/" },
  { label: "Behance", value: "bubu", href: "https://behance.net/" },
  { label: "LinkedIn", value: "bubu", href: "https://linkedin.com/" },
] as const;

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
      <header className="mb-12">
        <p className="font-accent text-rose-madder text-2xl">say hello</p>
        <h1 className="font-display text-ink-indigo mt-2 text-5xl tracking-tight italic sm:text-6xl">
          Send a note
        </h1>
        <p className="text-char-ink/75 mt-6 max-w-xl text-lg">
          Best way to reach me is email. Commissions, collaborations, press, or
          a studio visit — write a few lines and I&rsquo;ll reply within a
          week.
        </p>
      </header>

      <div className="grid gap-16 sm:grid-cols-[1fr_minmax(0,18rem)] sm:gap-20">
        <ContactForm />

        <aside className="sm:sticky sm:top-28 sm:self-start">
          <WhatsAppButton />

          <h2 className="font-display text-ink-indigo mt-10 text-2xl tracking-tight italic">
            Direct
          </h2>
          <ul className="divide-char-ink/15 mt-4 divide-y divide-dashed">
            {SOCIALS.map((s) => (
              <li key={s.label} className="py-3">
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-baseline justify-between gap-4"
                >
                  <span className="text-char-ink/55 font-mono text-[10px] uppercase tracking-widest">
                    {s.label}
                  </span>
                  <span className="font-display text-ink-indigo group-hover:text-marigold-deep text-lg italic transition-colors">
                    {s.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="text-char-ink/55 mt-8 font-mono text-[10px] uppercase tracking-widest">
            Based in Bengaluru — open to travel.
          </p>
        </aside>
      </div>
    </main>
  );
}
