import Link from "next/link";
import { getAllProjects } from "@/lib/mdx";
import { LogoutButton } from "../LogoutButton";
import { DeleteButton } from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <main className="bg-paper min-h-screen">
      <header className="border-char-ink/10 bg-paper/85 sticky top-0 z-10 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-6">
          <Link href="/admin/ingest" className="font-accent text-ink-indigo text-2xl font-semibold">
            Studio
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/admin/ingest" className="text-char-ink/60 hover:text-marigold-deep font-mono text-xs uppercase tracking-widest transition-colors">
              Import
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <p className="font-accent text-rose-madder text-2xl">manage</p>
        <h1 className="font-display text-ink-indigo mt-1 text-4xl tracking-tight italic">
          Projects
        </h1>
        <p className="text-char-ink/70 mt-3">{projects.length} published.</p>

        <ul className="mt-8 space-y-3">
          {projects.map((p) => (
            <li
              key={p.slug}
              className="border-char-ink/12 bg-cotton flex items-center gap-4 rounded-sm border p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.coverImage?.src ?? "/favicon.ico"}
                alt=""
                className="bg-paper-deep h-16 w-16 shrink-0 rounded-sm object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display text-ink-indigo truncate text-lg italic">
                  {p.title}
                </p>
                <p className="text-char-ink/55 font-mono text-[10px] uppercase tracking-widest">
                  {p.category} · {p.year} · /projects/{p.slug}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <a
                  href={`/projects/${p.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-char-ink/55 hover:text-marigold-deep text-xs font-medium transition-colors"
                >
                  View
                </a>
                <DeleteButton slug={p.slug} title={p.title} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
