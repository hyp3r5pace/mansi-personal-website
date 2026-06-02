import { NextResponse } from "next/server";
import { deleteProjectImages } from "@/lib/ingest/storage";

export const runtime = "nodejs";

/** Remove images uploaded for a draft that was abandoned (no orphans). */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const slug = (body as { slug?: unknown }).slug;
  if (typeof slug !== "string" || !slug) {
    return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  }
  try {
    await deleteProjectImages(slug);
  } catch {
    /* best-effort cleanup */
  }
  return NextResponse.json({ ok: true });
}
