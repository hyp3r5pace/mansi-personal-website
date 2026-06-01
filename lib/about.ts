import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const ABOUT_FILE = path.join(process.cwd(), "content", "about.mdx");

const TimelineEntrySchema = z.object({
  year: z.string(),
  title: z.string(),
  detail: z.string().optional(),
  place: z.string().optional(),
});

const CurrentlyEntrySchema = z.object({
  label: z.string(),
  value: z.string(),
});

const PressEntrySchema = z.object({
  publication: z.string(),
  title: z.string(),
  date: z.string(),
  href: z.string().url().optional(),
});

const AboutFrontmatterSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  portrait: z.string().optional(),
  portraitAlt: z.string().default("Portrait"),
  timeline: z.array(TimelineEntrySchema).default([]),
  currently: z.array(CurrentlyEntrySchema).default([]),
  press: z.array(PressEntrySchema).default([]),
});

export type AboutFrontmatter = z.infer<typeof AboutFrontmatterSchema>;
export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
export type CurrentlyEntry = z.infer<typeof CurrentlyEntrySchema>;
export type PressEntry = z.infer<typeof PressEntrySchema>;

export type About = AboutFrontmatter & { body: string };

export async function getAbout(): Promise<About> {
  const raw = await fs.readFile(ABOUT_FILE, "utf8");
  const { data, content } = matter(raw);
  const parsed = AboutFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Invalid frontmatter in content/about.mdx: ${parsed.error.message}`);
  }
  return { ...parsed.data, body: content };
}
