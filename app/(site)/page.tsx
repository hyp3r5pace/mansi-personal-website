import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-24 sm:px-10">
      <p className="font-accent text-rose-madder mb-4 text-2xl">welcome</p>
      <h1 className="font-display text-ink-indigo text-5xl leading-[1.05] tracking-tight italic sm:text-7xl">
        Bubu.
      </h1>
      <p className="text-char-ink/80 mt-6 max-w-xl text-lg">
        Textile-led fashion designer working between Jaipur and Delhi.
        Block print, kantha, and considered everyday wear.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/projects"
          className="bg-marigold text-ink-indigo hover:bg-marigold-deep inline-flex h-12 items-center rounded-full px-6 font-medium transition-colors"
        >
          See the work
        </Link>
        <Link
          href="/styleguide"
          className="border-ink-indigo text-ink-indigo hover:bg-ink-indigo hover:text-paper inline-flex h-12 items-center rounded-full border px-6 font-medium transition-colors"
        >
          Style guide
        </Link>
      </div>

      <p className="text-char-ink/50 mt-24 font-mono text-xs uppercase tracking-widest">
        Phase 1 · layout shell
      </p>
    </main>
  );
}
