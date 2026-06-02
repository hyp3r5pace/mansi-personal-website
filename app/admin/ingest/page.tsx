"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoutButton } from "../LogoutButton";
import { slugify, type ProjectDraft, type DraftImage } from "@/lib/ingest/types";

type Stage = "idle" | "loading" | "review" | "publishing" | "done" | "error";

const CATEGORIES = [
  "Ready-to-wear",
  "Couture",
  "Textile",
  "Collaboration",
] as const;

const LOADING_STEPS = [
  "Fetching the project…",
  "Downloading images…",
  "Reading & describing images…",
  "Almost there…",
];

export default function IngestPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [url, setUrl] = useState("");
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  // The slug images were stored under at draft time (so Discard can clean up
  // even if the editable slug below is changed).
  const [origSlug, setOrigSlug] = useState<string | null>(null);
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState<{ url: string } | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Animate the staged loading panel while the draft request is in flight.
  useEffect(() => {
    if (stage !== "loading") return;
    const id = setInterval(
      () => setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)),
      4000,
    );
    return () => clearInterval(id);
  }, [stage]);

  async function startImport() {
    setLoadingStep(0);
    setStage("loading");
    setError(null);
    try {
      const res = await fetch("/api/admin/ingest/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed.");
      setDraft(data.draft);
      setOrigSlug(data.draft.slug);
      setExistingSlugs(data.existingSlugs ?? []);
      setStage("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
      setStage("error");
    }
  }

  async function publish() {
    if (!draft) return;
    setStage("publishing");
    setError(null);
    try {
      const res = await fetch("/api/admin/ingest/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't publish.");
      setPublished({ url: data.url ?? `/projects/${draft.slug}` });
      setStage("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't publish.");
      setStage("review");
    }
  }

  function patch(p: Partial<ProjectDraft>) {
    setDraft((d) => (d ? { ...d, ...p } : d));
  }
  function patchImage(i: number, p: Partial<DraftImage>) {
    setDraft((d) =>
      d
        ? { ...d, images: d.images.map((im, j) => (j === i ? { ...im, ...p } : im)) }
        : d,
    );
  }
  function moveImage(i: number, dir: -1 | 1) {
    setDraft((d) => {
      if (!d) return d;
      const j = i + dir;
      if (j < 0 || j >= d.images.length) return d;
      const images = [...d.images];
      [images[i], images[j]] = [images[j], images[i]];
      let coverIndex = d.coverIndex;
      if (coverIndex === i) coverIndex = j;
      else if (coverIndex === j) coverIndex = i;
      return { ...d, images, coverIndex };
    });
  }

  const slugAvailable =
    !!draft && draft.slug.length > 0 && !existingSlugs.includes(draft.slug);
  const includedCount = draft?.images.filter((im) => im.include).length ?? 0;
  const canPublish =
    !!draft &&
    draft.title.trim().length > 0 &&
    slugAvailable &&
    includedCount > 0 &&
    draft.coverIndex >= 0;

  return (
    <main className="bg-paper min-h-screen">
      <header className="border-char-ink/10 bg-paper/85 sticky top-0 z-10 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-6">
          <Link href="/admin/ingest" className="font-accent text-ink-indigo text-2xl font-semibold">
            Studio
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/admin/projects" className="text-char-ink/60 hover:text-marigold-deep font-mono text-xs uppercase tracking-widest transition-colors">
              Projects
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        {/* ── URL input ───────────────────────────────────────────── */}
        {(stage === "idle" || stage === "loading" || stage === "error") && (
          <section>
            <p className="font-accent text-rose-madder text-2xl">import</p>
            <h1 className="font-display text-ink-indigo mt-1 text-4xl tracking-tight italic">
              Import a project
            </h1>
            <p className="text-char-ink/70 mt-3 max-w-prose">
              Paste a Behance project link. I&rsquo;ll bring in the images and
              draft the details for you to review.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.behance.net/gallery/…"
                disabled={stage === "loading"}
                className="border-char-ink/25 bg-paper text-ink-indigo focus:border-marigold-deep focus:ring-marigold-deep/30 w-full rounded-sm border px-4 py-3 text-base outline-none transition-colors focus:ring-2 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={startImport}
                disabled={stage === "loading" || !url.includes("behance.net")}
                className="bg-ink-indigo text-paper hover:bg-marigold-deep shrink-0 cursor-pointer rounded-sm px-6 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {stage === "loading" ? "Importing…" : "Import"}
              </button>
            </div>

            {stage === "loading" && (
              <ul className="mt-8 space-y-2">
                {LOADING_STEPS.map((label, i) => (
                  <li
                    key={label}
                    className={`flex items-center gap-3 text-sm transition-opacity ${i <= loadingStep ? "text-ink-indigo opacity-100" : "text-char-ink/40 opacity-60"}`}
                  >
                    <span>{i < loadingStep ? "✓" : i === loadingStep ? "◌" : "·"}</span>
                    {label}
                  </li>
                ))}
                <li className="text-char-ink/45 pt-2 text-xs">
                  This can take up to a minute for image-heavy projects.
                </li>
              </ul>
            )}

            {stage === "error" && error && (
              <p role="alert" className="border-rose-madder/40 text-rose-madder bg-rose-madder/5 mt-6 rounded-sm border px-4 py-3 text-sm">
                {error}
              </p>
            )}
          </section>
        )}

        {/* ── Review ──────────────────────────────────────────────── */}
        {stage !== "idle" && stage !== "loading" && stage !== "done" && draft && (
          <ReviewForm
            draft={draft}
            existingSlugs={existingSlugs}
            slugAvailable={slugAvailable}
            canPublish={canPublish}
            publishing={stage === "publishing"}
            error={error}
            onPatch={patch}
            onPatchImage={patchImage}
            onMoveImage={moveImage}
            onPublish={publish}
            onDiscard={() => {
              if (origSlug) {
                fetch("/api/admin/ingest/discard", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ slug: origSlug }),
                }).catch(() => {});
              }
              setDraft(null);
              setOrigSlug(null);
              setStage("idle");
              setUrl("");
            }}
          />
        )}

        {/* ── Done ────────────────────────────────────────────────── */}
        {stage === "done" && published && (
          <section className="border-leaf-green/40 bg-cotton rounded-sm border p-8 text-center">
            <p className="font-accent text-leaf-green text-2xl">published</p>
            <h2 className="font-display text-ink-indigo mt-1 text-3xl tracking-tight italic">
              It&rsquo;s on the way
            </h2>
            <p className="text-char-ink/70 mt-3">
              Your project will be live in a minute or two.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <a href={published.url} target="_blank" rel="noreferrer" className="bg-ink-indigo text-paper hover:bg-marigold-deep rounded-sm px-5 py-2.5 text-sm font-medium transition-colors">
                View project
              </a>
              <button
                type="button"
                onClick={() => {
                  setDraft(null);
                  setPublished(null);
                  setStage("idle");
                  setUrl("");
                }}
                className="text-char-ink/60 hover:text-marigold-deep text-sm font-medium transition-colors"
              >
                Import another
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

/* ───────────────────────────── Review form ───────────────────────────── */

function ReviewForm({
  draft,
  slugAvailable,
  canPublish,
  publishing,
  error,
  onPatch,
  onPatchImage,
  onMoveImage,
  onPublish,
  onDiscard,
}: {
  draft: ProjectDraft;
  existingSlugs: string[];
  slugAvailable: boolean;
  canPublish: boolean;
  publishing: boolean;
  error: string | null;
  onPatch: (p: Partial<ProjectDraft>) => void;
  onPatchImage: (i: number, p: Partial<DraftImage>) => void;
  onMoveImage: (i: number, dir: -1 | 1) => void;
  onPublish: () => void;
  onDiscard: () => void;
}) {
  const cover = draft.images[draft.coverIndex];
  const coverWide = cover && cover.width / cover.height > 2.2;

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-accent text-rose-madder text-2xl">review</p>
          <h1 className="font-display text-ink-indigo text-3xl tracking-tight italic">
            Check the details
          </h1>
        </div>
        <button type="button" onClick={onDiscard} className="text-char-ink/55 hover:text-rose-madder text-sm font-medium transition-colors">
          Discard
        </button>
      </div>

      {/* Project fields */}
      <div className="border-char-ink/12 bg-cotton grid gap-5 rounded-sm border p-6">
        <Field label="Title">
          <input value={draft.title} onChange={(e) => onPatch({ title: e.target.value })} className={inputCls} />
        </Field>

        <Field label="Web address" hint={slugAvailable ? "✓ available" : "⚠ already used — pick another"} hintTone={slugAvailable ? "ok" : "warn"}>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-char-ink/50">/projects/</span>
            <input value={draft.slug} onChange={(e) => onPatch({ slug: slugify(e.target.value) })} className={`${inputCls} flex-1`} />
          </div>
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Date">
            <input type="date" value={draft.date} onChange={(e) => onPatch({ date: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Category">
            <select value={draft.category} onChange={(e) => onPatch({ category: e.target.value as ProjectDraft["category"] })} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Show on home">
            <label className="mt-1 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.featured} onChange={(e) => onPatch({ featured: e.target.checked })} />
              Featured
            </label>
          </Field>
        </div>

        <Field label="Role">
          <input value={draft.role} onChange={(e) => onPatch({ role: e.target.value })} className={inputCls} placeholder="e.g. Design, textiles, embroidery" />
        </Field>
        <Field label="Short description">
          <input value={draft.excerpt} onChange={(e) => onPatch({ excerpt: e.target.value })} className={inputCls} />
        </Field>

        <Field label="Tags">
          <ChipInput values={draft.tags} onChange={(tags) => onPatch({ tags })} placeholder="add a tag" />
        </Field>
        <Field label="Materials">
          <ChipInput values={draft.materials} onChange={(materials) => onPatch({ materials })} placeholder="add a material" />
        </Field>
        <Field label="Colours">
          <PaletteEditor palette={draft.palette} onChange={(palette) => onPatch({ palette })} />
        </Field>
      </div>

      {/* Cover preview */}
      {cover && (
        <div>
          <p className="text-char-ink/55 font-mono text-[11px] uppercase tracking-widest">Cover</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover.src} alt="" className="ring-char-ink/15 mt-2 max-h-64 w-auto rounded-sm object-contain ring-1" />
          {coverWide && (
            <p className="text-marigold-deep mt-2 text-xs">
              This cover is very wide — it may crop oddly on the projects grid.
              Consider a taller image (click ☆ on one below).
            </p>
          )}
        </div>
      )}

      {/* Images */}
      <div>
        <p className="text-char-ink/55 font-mono text-[11px] uppercase tracking-widest">
          Images — reorder with ↑↓, ☆ sets the cover, uncheck to hide
        </p>
        <ul className="mt-3 space-y-3">
          {draft.images.map((im, i) => (
            <li
              key={im.src}
              className={`border-char-ink/12 flex gap-4 rounded-sm border p-3 ${im.include ? "bg-cotton" : "bg-paper-deep/40 opacity-60"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.src} alt="" className="h-24 w-24 shrink-0 rounded-sm object-cover" />
              <div className="grid flex-1 gap-2">
                <input value={im.alt} onChange={(e) => onPatchImage(i, { alt: e.target.value })} placeholder="Describe this image (alt text)" className={`${inputCls} text-sm`} />
                <input value={im.caption} onChange={(e) => onPatchImage(i, { caption: e.target.value })} placeholder="Caption (optional)" className={`${inputCls} text-sm`} />
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={im.include} onChange={(e) => onPatchImage(i, { include: e.target.checked })} />
                    Show
                  </label>
                  <button type="button" onClick={() => onPatch({ coverIndex: i })} className={draft.coverIndex === i ? "text-marigold-deep font-semibold" : "text-char-ink/55 hover:text-marigold-deep"}>
                    {draft.coverIndex === i ? "★ cover" : "☆ cover"}
                  </button>
                  <select value={im.layout ?? ""} onChange={(e) => onPatchImage(i, { layout: (e.target.value || undefined) as DraftImage["layout"] })} className="border-char-ink/20 rounded-sm border bg-paper px-2 py-1">
                    <option value="">Auto layout</option>
                    <option value="full">Full width</option>
                    <option value="pair">Side-by-side</option>
                    <option value="contained">Default</option>
                  </select>
                  <span className="ml-auto flex gap-1">
                    <button type="button" onClick={() => onMoveImage(i, -1)} className="hover:text-marigold-deep px-1" aria-label="Move up">↑</button>
                    <button type="button" onClick={() => onMoveImage(i, 1)} className="hover:text-marigold-deep px-1" aria-label="Move down">↓</button>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <p role="alert" className="border-rose-madder/40 text-rose-madder bg-rose-madder/5 rounded-sm border px-4 py-3 text-sm">
          {error}
        </p>
      )}

      <div className="border-char-ink/10 sticky bottom-0 -mx-6 flex items-center justify-between border-t bg-paper/90 px-6 py-4 backdrop-blur-sm">
        <span className="text-char-ink/55 text-xs">
          {draft.images.filter((i) => i.include).length} images will be shown
        </span>
        <button
          type="button"
          onClick={onPublish}
          disabled={!canPublish || publishing}
          className="bg-ink-indigo text-paper hover:bg-marigold-deep cursor-pointer rounded-sm px-6 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {publishing ? "Publishing…" : "Publish to site"}
        </button>
      </div>
    </section>
  );
}

/* ───────────────────────────── small pieces ───────────────────────────── */

const inputCls =
  "border-char-ink/25 bg-paper text-ink-indigo focus:border-marigold-deep focus:ring-marigold-deep/30 w-full rounded-sm border px-3 py-2 outline-none transition-colors focus:ring-2";

function Field({
  label,
  hint,
  hintTone,
  children,
}: {
  label: string;
  hint?: string;
  hintTone?: "ok" | "warn";
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-char-ink/65 font-mono text-[11px] uppercase tracking-widest">
        {label}
        {hint && (
          <span className={`ml-2 normal-case ${hintTone === "warn" ? "text-rose-madder" : "text-leaf-green"}`}>
            {hint}
          </span>
        )}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function ChipInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  function add() {
    const v = text.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setText("");
  }
  return (
    <div className="border-char-ink/25 bg-paper flex flex-wrap items-center gap-1.5 rounded-sm border px-2 py-1.5">
      {values.map((v) => (
        <span key={v} className="bg-paper-deep text-ink-indigo flex items-center gap-1 rounded-sm px-2 py-0.5 text-sm">
          {v}
          <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="text-char-ink/50 hover:text-rose-madder" aria-label={`Remove ${v}`}>✕</button>
        </span>
      ))}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); add(); }
        }}
        onBlur={add}
        placeholder={placeholder}
        className="min-w-24 flex-1 bg-transparent px-1 py-0.5 text-sm outline-none"
      />
    </div>
  );
}

function PaletteEditor({
  palette,
  onChange,
}: {
  palette: { name: string; hex: string }[];
  onChange: (p: { name: string; hex: string }[]) => void;
}) {
  function update(i: number, p: Partial<{ name: string; hex: string }>) {
    onChange(palette.map((s, j) => (j === i ? { ...s, ...p } : s)));
  }
  return (
    <div className="flex flex-wrap gap-2">
      {palette.map((s, i) => (
        <div key={i} className="border-char-ink/20 flex items-center gap-1 rounded-sm border bg-paper px-1.5 py-1">
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(s.hex) ? s.hex : "#cccccc"} onChange={(e) => update(i, { hex: e.target.value })} className="h-6 w-6 cursor-pointer rounded" />
          <input value={s.name} onChange={(e) => update(i, { name: e.target.value })} className="w-20 bg-transparent text-sm outline-none" />
          <button type="button" onClick={() => onChange(palette.filter((_, j) => j !== i))} className="text-char-ink/40 hover:text-rose-madder text-xs" aria-label="Remove colour">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...palette, { name: "colour", hex: "#cccccc" }])} className="border-char-ink/25 text-char-ink/60 hover:text-marigold-deep rounded-sm border border-dashed px-3 py-1 text-sm">
        + add
      </button>
    </div>
  );
}
