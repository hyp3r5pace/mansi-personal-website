/** Shared shapes for the ingestion draft passed between API and review UI. */

export type DraftImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  /** Vision/heuristic flag: a logo/divider/tiny crop, not real content. */
  decorative: boolean;
  /** Whether to include in the published gallery (defaults to !decorative). */
  include: boolean;
  /** Optional per-image layout override for the gallery rhythm. */
  layout?: "full" | "contained" | "pair";
};

export type ProjectDraft = {
  title: string;
  slug: string;
  date: string; // YYYY-MM-DD
  category: "Couture" | "Ready-to-wear" | "Textile" | "Collaboration";
  role: string;
  excerpt: string;
  materials: string[];
  collaborators: string[];
  tags: string[];
  palette: { name: string; hex: string }[];
  featured: boolean;
  /** Index into `images` selected as the cover. */
  coverIndex: number;
  images: DraftImage[];
  /** Optional body prose (markdown). */
  body: string;
};

/** Slugify a title into a URL-safe web address. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Swap a Behance module URL to a smaller variant for the vision payload. */
export function thumbVariantUrl(fullUrl: string): string {
  return fullUrl.replace(
    /\/project_modules\/[a-z0-9_]+\//,
    "/project_modules/1400_webp/",
  );
}
