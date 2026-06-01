import type { Metadata } from "next";
import { getAbout } from "@/lib/about";
import { Bio } from "@/components/about/Bio";
import { KanthaPortrait } from "@/components/about/KanthaPortrait";
import { Timeline } from "@/components/about/Timeline";
import { Currently } from "@/components/about/Currently";
import { Press } from "@/components/about/Press";

export const metadata: Metadata = {
  title: "About",
  description: "About the designer — practice, training, and what's currently on the table.",
};

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
      <p className="font-accent text-rose-madder text-2xl">about me</p>
      <h1 className="font-display text-ink-indigo mt-2 text-5xl tracking-tight italic sm:text-6xl">
        {about.title}
      </h1>
      {about.subtitle ? (
        <p className="text-char-ink/70 mt-4 max-w-xl text-lg">{about.subtitle}</p>
      ) : null}

      <div className="mt-16 grid gap-12 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-16">
        <KanthaPortrait
          src={about.portrait}
          alt={about.portraitAlt}
          className="sm:sticky sm:top-28 sm:self-start"
        />
        <div>
          <Bio source={about.body} />
          <div className="mt-12">
            <Currently entries={about.currently} />
          </div>
        </div>
      </div>

      <section className="mt-24">
        <header className="mb-8">
          <p className="text-char-ink/55 font-mono text-[10px] uppercase tracking-widest">
            Practice
          </p>
          <h2 className="font-display text-ink-indigo mt-1 text-3xl tracking-tight italic sm:text-4xl">
            A stitched timeline
          </h2>
        </header>
        <Timeline entries={about.timeline} />
      </section>

      {about.press.length > 0 ? (
        <section className="mt-24">
          <Press entries={about.press} />
        </section>
      ) : null}
    </main>
  );
}
