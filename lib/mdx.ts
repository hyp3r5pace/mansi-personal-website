import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content");

/* ------------------------------ schemas ------------------------------ */

const SwatchSchema = z.object({
  name: z.string(),
  hex: z.string().regex(/^#[0-9A-Fa-f]{3,8}$/),
});

const MoodBoardImageSchema = z.object({
  src: z.string().optional(),
  alt: z.string(),
  label: z.string().optional(),
  caption: z.string().optional(),
  palette: z.array(SwatchSchema).optional(),
});

const ProcessRowSchema = z.object({
  text: z.string(),
  align: z.enum(["left", "right"]).optional(),
  caption: z.string().optional(),
  image: MoodBoardImageSchema,
});

/**
 * A real photograph in a project's lookbook gallery. `width`/`height` are the
 * intrinsic pixel dimensions — used both by next/image and by the gallery's
 * auto-rhythm to decide full-bleed vs contained vs paired. `layout` overrides
 * that automatic choice when set.
 */
const LookbookItemSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  caption: z.string().optional(),
  layout: z.enum(["full", "contained", "pair"]).optional(),
});

export type LookbookItem = z.infer<typeof LookbookItemSchema>;

const CoverImageSchema = z.object({
  src: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  /** When true, render the image bare (no gradient/title band over it). */
  bare: z.boolean().optional(),
});

const ProjectFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: z.coerce.date(),
  year: z.number().int(),
  category: z.enum(["Couture", "Ready-to-wear", "Textile", "Collaboration"]),
  role: z.string(),
  materials: z.array(z.string()).default([]),
  collaborators: z.array(z.string()).default([]),
  cover: z.string(),
  /** Optional real cover photo; falls back to the palette placeholder. */
  coverImage: CoverImageSchema.optional(),
  gallery: z.array(z.string()).default([]),
  /** Rich image-led gallery for photo-heavy projects (lookbooks). */
  lookbook: z.array(LookbookItemSchema).default([]),
  palette: z.array(SwatchSchema).default([]),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  excerpt: z.string().optional(),
  moodBoard: z.array(MoodBoardImageSchema).default([]),
  processRows: z.array(ProcessRowSchema).default([]),
});

const BlogFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: z.coerce.date(),
  cover: z.string().optional(),
  excerpt: z.string(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;
export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;

export type Project = ProjectFrontmatter & { body: string };
export type BlogPost = BlogFrontmatter & { body: string; readingMinutes: number };

/* ------------------------------ utils ------------------------------ */

/**
 * Word-count based reading time. Strips MDX/HTML-ish tokens so component
 * tags don't inflate the count. Defaults to 220 wpm — slower than typical
 * pulp fiction, faster than dense theory; a fair guess for studio prose.
 */
export function estimateReadingMinutes(body: string, wpm = 220): number {
  const plain = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/[#*_`>~\-[\]()!]/g, " ");
  const words = plain.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wpm));
}

/* ------------------------------ loaders ------------------------------ */

async function readMdxDir(dir: string): Promise<{ file: string; raw: string }[]> {
  const full = path.join(CONTENT_DIR, dir);
  let entries: string[];
  try {
    entries = await fs.readdir(full);
  } catch {
    return [];
  }
  const files = entries.filter((f) => f.endsWith(".mdx"));
  return Promise.all(
    files.map(async (file) => ({
      file,
      raw: await fs.readFile(path.join(full, file), "utf8"),
    })),
  );
}

export async function getAllProjects(): Promise<Project[]> {
  const files = await readMdxDir("projects");
  const projects = files.map(({ file, raw }) => {
    const { data, content } = matter(raw);
    const parsed = ProjectFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `Invalid frontmatter in content/projects/${file}: ${parsed.error.message}`,
      );
    }
    return { ...parsed.data, body: content };
  });
  return projects.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.featured).slice(0, limit);
}

export async function getAllPosts(opts: { includeDrafts?: boolean } = {}): Promise<BlogPost[]> {
  const files = await readMdxDir("blog");
  const posts = files.map(({ file, raw }) => {
    const { data, content } = matter(raw);
    const parsed = BlogFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `Invalid frontmatter in content/blog/${file}: ${parsed.error.message}`,
      );
    }
    return {
      ...parsed.data,
      body: content,
      readingMinutes: estimateReadingMinutes(content),
    };
  });
  const visible = opts.includeDrafts ? posts : posts.filter((p) => !p.draft);
  return visible.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getAllPosts({ includeDrafts: true });
  return all.find((p) => p.slug === slug) ?? null;
}
