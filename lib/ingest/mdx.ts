import matter from "gray-matter";
import { ProjectFrontmatterSchema } from "@/lib/mdx";
import type { ProjectDraft } from "@/lib/ingest/types";

/**
 * Turn a reviewed draft into the project MDX file, and validate it against the
 * same schema the site loads at build time. Validation is the safety gate: an
 * invalid file would break the production build, so we reject before commit.
 */

export function buildProjectMdx(draft: ProjectDraft): string {
  const cover = draft.images[draft.coverIndex];
  if (!cover) throw new Error("No cover image selected.");

  const lookbook = draft.images
    .filter((im, i) => im.include && i !== draft.coverIndex)
    .map((im) => ({
      src: im.src,
      alt: im.alt,
      width: im.width,
      height: im.height,
      ...(im.caption.trim() ? { caption: im.caption.trim() } : {}),
      ...(im.layout ? { layout: im.layout } : {}),
    }));

  const frontmatter: Record<string, unknown> = {
    title: draft.title.trim(),
    slug: draft.slug,
    date: draft.date,
    year: new Date(draft.date).getFullYear(),
    category: draft.category,
    role: draft.role.trim(),
    materials: draft.materials,
    collaborators: draft.collaborators,
    cover: cover.src,
    coverImage: { src: cover.src, width: cover.width, height: cover.height },
    gallery: [],
    lookbook,
    palette: draft.palette,
    tags: draft.tags,
    featured: draft.featured,
    ...(draft.excerpt.trim() ? { excerpt: draft.excerpt.trim() } : {}),
  };

  const body = draft.body.trim()
    ? `${draft.body.trim()}\n`
    : `## ${draft.title.trim()}\n`;

  return matter.stringify(body, frontmatter);
}

/** Re-parse the generated MDX through the live schema; throws on any problem. */
export function validateProjectMdx(mdx: string): void {
  const { data } = matter(mdx);
  const parsed = ProjectFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Generated project is invalid: ${parsed.error.issues
        .map((i) => `${i.path.join(".")} ${i.message}`)
        .join("; ")}`,
    );
  }
}
