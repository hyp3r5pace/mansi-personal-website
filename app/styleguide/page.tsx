import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Style guide",
  description: "Color tokens, typography, and component states.",
};

const palette: { name: string; varName: string; hex: string; onDark?: boolean }[] = [
  { name: "Ink Indigo", varName: "bg-ink-indigo", hex: "#1F2A56", onDark: true },
  { name: "Indigo Deep", varName: "bg-indigo-deep", hex: "#14193A", onDark: true },
  { name: "Indigo Soft", varName: "bg-indigo-soft", hex: "#3A4A8A", onDark: true },
  { name: "Marigold", varName: "bg-marigold", hex: "#E8A33D" },
  { name: "Marigold Deep", varName: "bg-marigold-deep", hex: "#C97A1A", onDark: true },
  { name: "Saffron", varName: "bg-saffron", hex: "#F2C36B" },
  { name: "Rose Madder", varName: "bg-rose-madder", hex: "#B5495B", onDark: true },
  { name: "Leaf Green", varName: "bg-leaf-green", hex: "#6B8E4E", onDark: true },
  { name: "Paper", varName: "bg-paper", hex: "#F6EFE2" },
  { name: "Paper Deep", varName: "bg-paper-deep", hex: "#ECE2CE" },
  { name: "Cotton", varName: "bg-cotton", hex: "#FAF6EC" },
  { name: "Char Ink", varName: "bg-char-ink", hex: "#2A2620", onDark: true },
];

export default function StyleguidePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-10">
      <header className="mb-16">
        <p className="font-accent text-rose-madder text-2xl">style guide</p>
        <h1 className="font-display text-ink-indigo mt-2 text-5xl tracking-tight italic">
          Tokens & type
        </h1>
        <p className="text-char-ink/70 mt-4 max-w-xl">
          Source of truth for color and typography. Update tokens in
          <code className="bg-paper-deep mx-1 rounded px-1.5 py-0.5 font-mono text-sm">
            app/globals.css
          </code>
          and they propagate everywhere.
        </p>
      </header>

      <section className="mb-20">
        <h2 className="font-display text-ink-indigo mb-6 text-2xl">Palette</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {palette.map((p) => (
            <div
              key={p.varName}
              className={`stitch-border flex h-32 flex-col justify-between p-4 ${p.varName} ${
                p.onDark ? "text-paper" : "text-char-ink"
              }`}
            >
              <span className="font-display text-lg">{p.name}</span>
              <div className="font-mono text-xs opacity-80">
                <div>{p.hex}</div>
                <div className="mt-0.5">{p.varName}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-ink-indigo mb-6 text-2xl">Typography</h2>
        <div className="space-y-8">
          <div>
            <p className="text-char-ink/50 mb-1 font-mono text-xs uppercase tracking-widest">
              Display · Fraunces · italic
            </p>
            <p className="font-display text-ink-indigo text-6xl tracking-tight italic">
              Considered, hand-made.
            </p>
          </div>
          <div>
            <p className="text-char-ink/50 mb-1 font-mono text-xs uppercase tracking-widest">
              Body · Inter
            </p>
            <p className="max-w-2xl text-lg leading-relaxed">
              A textile-led practice rooted in Indian craft. Each piece begins on
              paper, then in the dye yard, and finally on the cutting table — a
              process that moves at the speed of the cloth, not the season.
            </p>
          </div>
          <div>
            <p className="text-char-ink/50 mb-1 font-mono text-xs uppercase tracking-widest">
              Accent · Caveat
            </p>
            <p className="font-accent text-rose-madder text-4xl">
              from the studio notebook
            </p>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-ink-indigo mb-6 text-2xl">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-marigold text-ink-indigo hover:bg-marigold-deep h-12 rounded-full px-6 font-medium transition-colors">
            Primary
          </button>
          <button className="border-ink-indigo text-ink-indigo hover:bg-ink-indigo hover:text-paper h-12 rounded-full border px-6 font-medium transition-colors">
            Secondary
          </button>
          <button className="bg-rose-madder text-paper hover:bg-rose-madder/90 h-12 rounded-full px-6 font-medium transition-colors">
            Accent
          </button>
          <button className="text-ink-indigo hover:bg-paper-deep h-12 rounded-full px-6 font-medium transition-colors">
            Ghost
          </button>
        </div>
      </section>

      <section>
        <h2 className="font-display text-ink-indigo mb-6 text-2xl">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {["Couture", "Ready-to-wear", "Textile", "Collaboration"].map((t) => (
            <span
              key={t}
              className="stitch-border text-ink-indigo bg-paper-deep px-3 py-1 text-sm"
            >
              {t}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
