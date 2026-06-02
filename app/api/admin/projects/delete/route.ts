import { NextResponse } from "next/server";
import { deleteProjectFile } from "@/lib/ingest/github";
import { deleteProjectImages } from "@/lib/ingest/storage";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Unpublish a project: remove its MDX (a commit) and its stored images. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const slug = (body as { slug?: unknown }).slug;
  if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid project." }, { status: 400 });
  }

  try {
    const result = await deleteProjectFile(slug);
    await deleteProjectImages(slug).catch(() => {}); // best-effort
    return NextResponse.json({ ok: true, committed: result.committed });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Couldn't remove project." },
      { status: 502 },
    );
  }
}
