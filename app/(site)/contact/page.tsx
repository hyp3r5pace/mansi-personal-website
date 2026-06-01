import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { SITE, COPY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about commissions, collaborations, or studio visits.",
};

const SOCIALS = SITE.socials.map((s) => ({
  label: s.label,
  value: s.handle,
  href: s.href,
}));

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
      <header className="mb-12">
        <p className="font-accent text-rose-madder text-2xl">
          {COPY.contactPage.eyebrow}
        </p>
        <h1 className="font-display text-ink-indigo mt-2 text-5xl tracking-tight italic sm:text-6xl">
          {COPY.contactPage.heading}
        </h1>
        <p className="text-char-ink/75 mt-6 max-w-xl text-lg">
          {COPY.contactPage.intro}
        </p>
      </header>

      <div className="grid gap-16 sm:grid-cols-[1fr_minmax(0,18rem)] sm:gap-20">
        <ContactForm />

        <aside className="sm:sticky sm:top-28 sm:self-start">
          <WhatsAppButton />

          <h2 className="font-display text-ink-indigo mt-10 text-2xl tracking-tight italic">
            {COPY.contactPage.directHeading}
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
            {SITE.location.line}
          </p>
        </aside>
      </div>
    </main>
  );
}
