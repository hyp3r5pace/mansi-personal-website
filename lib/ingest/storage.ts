import fs from "node:fs/promises";
import path from "node:path";
import { put, list, del } from "@vercel/blob";

/**
 * Image storage for ingested projects.
 *
 * Production (Vercel) uses Vercel Blob — the committed repo only carries the
 * small MDX file, so it stays lean. Local development (no BLOB token) falls
 * back to writing into `public/projects/<slug>/`, matching how the
 * hand-imported projects are stored, so the flow is testable end-to-end.
 *
 * Both return a `src` usable directly in frontmatter and next/image:
 * an absolute Blob URL in production, a root-relative path in dev.
 */

export type StoredImage = { src: string; pathname: string };

const usingBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const publicDir = () => path.join(process.cwd(), "public");

export async function putProjectImage(
  slug: string,
  filename: string,
  data: Uint8Array,
  contentType: string,
): Promise<StoredImage> {
  const pathname = `projects/${slug}/${filename}`;

  if (usingBlob()) {
    const { url } = await put(pathname, Buffer.from(data), {
      access: "public",
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return { src: url, pathname };
  }

  // Dev fallback → public/
  const abs = path.join(publicDir(), pathname);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, data);
  return { src: `/${pathname}`, pathname };
}

export async function deleteProjectImages(slug: string): Promise<void> {
  if (usingBlob()) {
    const { blobs } = await list({ prefix: `projects/${slug}/` });
    if (blobs.length > 0) await del(blobs.map((b) => b.url));
    return;
  }
  await fs.rm(path.join(publicDir(), "projects", slug), {
    recursive: true,
    force: true,
  });
}
