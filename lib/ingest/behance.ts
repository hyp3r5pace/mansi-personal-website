/**
 * Behance project scraper.
 *
 * Behance has no public read API for arbitrary galleries, so we fetch the
 * public project page and pull image module URLs out of the server-rendered
 * HTML. For each image we choose the highest-resolution variant Behance
 * exposes so the imported imagery doesn't degrade. This is the fragile part
 * of the pipeline by nature — it is isolated here so it's easy to repair if
 * Behance changes its markup or variant tokens.
 */

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

// Largest → smallest by max pixel dimension, so imported imagery is the
// highest resolution Behance exposes. `max_3840_webp` is the biggest tier;
// `fs_webp` ("fullscreen") is typically capped ~1920, so it sits below the
// larger max_*/numeric tiers. We never pick below 1400.
const VARIANT_PRIORITY = [
  "max_3840_webp",
  "2800_webp",
  "max_2400_webp",
  "fs_webp",
  "1400_webp",
  "1400",
  "disp",
  "disp_webp",
];

export type BehanceProject = {
  projectId: string;
  title: string;
  /** ISO date string if found on the page, else null. */
  date: string | null;
  imageUrls: string[];
};

export class BehanceFetchError extends Error {}

function extractProjectId(url: string): string {
  const m = url.match(/behance\.net\/gallery\/(\d+)/);
  if (!m) {
    throw new BehanceFetchError(
      "That doesn't look like a Behance project link. It should look like behance.net/gallery/<number>/<name>.",
    );
  }
  return m[1];
}

function extractTitle(html: string, fallback: string): string {
  const og = html.match(
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
  );
  const raw = og?.[1] ?? html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? fallback;
  return decodeEntities(raw)
    .replace(/\s*::\s*Behance.*$/i, "")
    .replace(/\s*on Behance\s*$/i, "")
    .replace(/\s*\|\s*Behance\s*$/i, "")
    .trim();
}

function extractDate(html: string): string | null {
  const iso =
    html.match(
      /["'](?:datePublished|published_time)["']\s*[:=]\s*["']([^"']+)["']/i,
    )?.[1] ??
    html.match(
      /<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
    )?.[1];
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Pull ordered, de-duplicated module image URLs at their best variant.
 * A single image appears under many size folders sharing the same filename
 * (`<hash><projectId>.<timestamp>.<ext>`); we group by filename, keep first
 * appearance order, and resolve each to the best available variant.
 */
function extractImageUrls(html: string, projectId: string): string[] {
  const re = new RegExp(
    `https://mir-s3-cdn-cf\\.behance\\.net/project_modules/([a-z0-9_]+)/([a-z0-9]+${projectId}\\.[a-z0-9]+\\.(?:jpe?g|png|webp))`,
    "g",
  );
  const order: string[] = [];
  const sizesByFile = new Map<string, Set<string>>();
  for (const match of html.matchAll(re)) {
    const size = match[1];
    const filename = match[2];
    if (!sizesByFile.has(filename)) {
      sizesByFile.set(filename, new Set());
      order.push(filename);
    }
    sizesByFile.get(filename)!.add(size);
  }

  return order.map((filename) => {
    const sizes = sizesByFile.get(filename)!;
    const best =
      VARIANT_PRIORITY.find((v) => sizes.has(v)) ?? [...sizes][0];
    return `https://mir-s3-cdn-cf.behance.net/project_modules/${best}/${filename}`;
  });
}

export async function fetchBehanceProject(
  url: string,
): Promise<BehanceProject> {
  const projectId = extractProjectId(url);

  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) {
      throw new BehanceFetchError(
        `Couldn't read that Behance link (status ${res.status}). Make sure it's a public project and try again.`,
      );
    }
    html = await res.text();
  } catch (err) {
    if (err instanceof BehanceFetchError) throw err;
    throw new BehanceFetchError(
      "Couldn't reach Behance. Check the link and your connection, then try again.",
    );
  }

  const imageUrls = extractImageUrls(html, projectId);
  if (imageUrls.length === 0) {
    throw new BehanceFetchError(
      "Found the page but no project images. The project may be private, or Behance changed its layout.",
    );
  }

  return {
    projectId,
    title: extractTitle(html, "Untitled project"),
    date: extractDate(html),
    imageUrls,
  };
}
