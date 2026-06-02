import { NextResponse } from "next/server";
import { fetchBehanceProject, BehanceFetchError } from "@/lib/ingest/behance";
import { downloadImage } from "@/lib/ingest/images";
import { putProjectImage } from "@/lib/ingest/storage";
import {
  draftMetadata,
  visionAvailable,
  type VisionDraft,
  type VisionImageInput,
} from "@/lib/ingest/vision";
import { slugify, thumbVariantUrl, type ProjectDraft } from "@/lib/ingest/types";
import { getAllProjects } from "@/lib/mdx";

export const runtime = "nodejs";
export const maxDuration = 60;

function cleanTitle(raw: string): string {
  return raw
    .replace(/\s*::\s*Behance.*$/i, "")
    .replace(/\s+[-–—]\s+[a-z][a-z .'-]*$/u, "") // trailing " - author name"
    .trim();
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const url = (body as { url?: unknown }).url;
  if (typeof url !== "string" || !url.includes("behance.net")) {
    return NextResponse.json(
      { error: "Paste a Behance project link (behance.net/gallery/…)." },
      { status: 400 },
    );
  }

  let project;
  try {
    project = await fetchBehanceProject(url);
  } catch (err) {
    const message =
      err instanceof BehanceFetchError
        ? err.message
        : "Couldn't read that Behance link. Please try again.";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  const slug = slugify(cleanTitle(project.title));

  // Download originals → store; fetch small variants for the vision payload.
  const stored: { src: string; width: number; height: number }[] = [];
  const visionInputs: VisionImageInput[] = [];
  try {
    let i = 0;
    for (const imgUrl of project.imageUrls) {
      i += 1;
      const full = await downloadImage(imgUrl);
      const filename = `${String(i).padStart(2, "0")}.${full.ext}`;
      const { src } = await putProjectImage(
        slug,
        filename,
        full.data,
        full.contentType,
      );
      stored.push({ src, width: full.width, height: full.height });

      let b64 = Buffer.from(full.data).toString("base64");
      let media = full.contentType;
      try {
        const thumb = await downloadImage(thumbVariantUrl(imgUrl));
        b64 = Buffer.from(thumb.data).toString("base64");
        media = thumb.contentType;
      } catch {
        /* fall back to full bytes */
      }
      visionInputs.push({
        mediaType: media as VisionImageInput["mediaType"],
        base64: b64,
        width: full.width,
        height: full.height,
      });
    }
  } catch {
    return NextResponse.json(
      { error: "Couldn't download one of the images. Please try again." },
      { status: 502 },
    );
  }

  // Vision drafting (best-effort; degrade to heuristics if unavailable).
  let vision: VisionDraft | null = null;
  if (visionAvailable()) {
    try {
      vision = await draftMetadata(visionInputs, { titleHint: project.title });
    } catch {
      vision = null;
    }
  }

  const images = stored.map((s, i) => {
    const meta = vision?.images[i];
    const decorative =
      meta?.decorative ?? Math.min(s.width, s.height) < 600;
    return {
      src: s.src,
      width: s.width,
      height: s.height,
      alt: meta?.alt ?? "",
      caption: meta?.caption ?? "",
      decorative,
      include: !decorative,
    };
  });

  // Cover: vision pick if sensible, else first included non-ultra-wide image.
  const isOkCover = (i: number) =>
    i >= 0 && i < images.length && images[i].width / images[i].height <= 2.2;
  let coverIndex = vision?.coverIndex ?? -1;
  if (!isOkCover(coverIndex)) {
    coverIndex = images.findIndex(
      (im) => im.include && im.width / im.height <= 2.2,
    );
  }
  if (coverIndex < 0) coverIndex = images.findIndex((im) => im.include);
  if (coverIndex < 0) coverIndex = 0;

  const draft: ProjectDraft = {
    title: vision?.title?.trim() || cleanTitle(project.title),
    slug,
    date: project.date ?? new Date().toISOString().slice(0, 10),
    category: vision?.category ?? "Ready-to-wear",
    role: vision?.role ?? "",
    excerpt: vision?.excerpt ?? "",
    materials: vision?.materials ?? [],
    collaborators: [],
    tags: vision?.tags ?? [],
    palette: vision?.palette ?? [],
    featured: false,
    coverIndex,
    images,
    body: "",
  };

  const existing = await getAllProjects()
    .then((ps) => ps.map((p) => p.slug))
    .catch(() => [] as string[]);

  return NextResponse.json({
    draft,
    existingSlugs: existing,
    visionUsed: vision !== null,
  });
}
