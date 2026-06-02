import { NextResponse } from "next/server";
import { buildProjectMdx, validateProjectMdx } from "@/lib/ingest/mdx";
import { publishProjectFile } from "@/lib/ingest/github";
import { getAllProjects } from "@/lib/mdx";
import type { ProjectDraft } from "@/lib/ingest/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const draft = (body as { draft?: ProjectDraft }).draft;

  if (!draft || typeof draft !== "object") {
    return NextResponse.json({ error: "Nothing to publish." }, { status: 400 });
  }
  if (!draft.slug || !draft.title?.trim()) {
    return NextResponse.json(
      { error: "A title and web address are required." },
      { status: 400 },
    );
  }
  if (!draft.images.some((im) => im.include)) {
    return NextResponse.json(
      { error: "Include at least one image." },
      { status: 400 },
    );
  }

  // Slug collision (re-checked server-side).
  const existing = await getAllProjects()
    .then((ps) => ps.map((p) => p.slug))
    .catch(() => [] as string[]);
  if (existing.includes(draft.slug)) {
    return NextResponse.json(
      { error: `That web address is already used — pick another.` },
      { status: 409 },
    );
  }

  // Build + validate before writing anything.
  let mdx: string;
  try {
    mdx = buildProjectMdx(draft);
    validateProjectMdx(mdx);
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? `Couldn't prepare the project: ${err.message}`
            : "Couldn't prepare the project.",
      },
      { status: 422 },
    );
  }

  try {
    const result = await publishProjectFile(draft.slug, mdx);
    return NextResponse.json({
      ok: true,
      url: `/projects/${draft.slug}`,
      committed: result.committed,
      commitUrl: result.commitUrl,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Couldn't publish the project.",
      },
      { status: 502 },
    );
  }
}
