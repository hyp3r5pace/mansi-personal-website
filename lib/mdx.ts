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
  gallery: z.array(z.string()).default([]),
  palette: z.array(SwatchSchema).default([]),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  excerpt: z.string().optional(),
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
export type BlogPost = BlogFrontmatter & { body: string };

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
    return { ...parsed.data, body: content };
  });
  const visible = opts.includeDrafts ? posts : posts.filter((p) => !p.draft);
  return visible.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getAllPosts({ includeDrafts: true });
  return all.find((p) => p.slug === slug) ?? null;
}
