import { imageSize } from "image-size";

/**
 * Download a Behance CDN image and measure it. We keep the original bytes —
 * no re-encoding — so quality matches the source; next/image handles
 * display-time optimisation. The CDN expects a browser UA and a Behance
 * referer.
 */

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

export type DownloadedImage = {
  data: Uint8Array;
  width: number;
  height: number;
  /** image-size type token, e.g. "webp" | "png" | "jpg". */
  type: string;
  ext: string;
  contentType: string;
};

const EXT_BY_TYPE: Record<string, string> = {
  jpg: "jpg",
  jpeg: "jpg",
  png: "png",
  webp: "webp",
  gif: "gif",
};

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function downloadImage(url: string): Promise<DownloadedImage> {
  const res = await fetch(url, {
    headers: { "User-Agent": BROWSER_UA, Referer: "https://www.behance.net/" },
  });
  if (!res.ok) {
    throw new Error(`Image download failed (${res.status}) for ${url}`);
  }
  const data = new Uint8Array(await res.arrayBuffer());

  const dims = imageSize(data);
  if (!dims.width || !dims.height) {
    throw new Error(`Could not read image dimensions for ${url}`);
  }
  const type = (dims.type ?? "jpg").toLowerCase();
  const ext = EXT_BY_TYPE[type] ?? "jpg";

  return {
    data,
    width: dims.width,
    height: dims.height,
    type,
    ext,
    contentType: CONTENT_TYPE_BY_EXT[ext] ?? "application/octet-stream",
  };
}
