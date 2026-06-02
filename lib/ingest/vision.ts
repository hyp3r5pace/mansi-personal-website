import Anthropic from "@anthropic-ai/sdk";

/**
 * Claude vision drafting for an imported project.
 *
 * One batched call describes every image (alt + caption + a "decorative"
 * flag for logos/dividers/tiny crops) and proposes project-level fields:
 * a crop-friendly cover, category, role, excerpt, materials, tags, and a
 * palette sampled from the imagery. Everything it returns is a *draft* the
 * owner edits in the review UI.
 *
 * The static instructions are sent as a cached system prompt; only the
 * per-project images vary between calls.
 */

const MODEL = "claude-sonnet-4-6";

const SYSTEM = `You are helping a fashion designer import a portfolio project (originally on Behance) onto her personal website. You will be shown the project's images in order. Produce concise, accurate, human-sounding metadata in the designer's own understated voice — never marketing fluff, never invented facts.

For each image, in order:
- alt: a literal, descriptive alt text (garments, colours, layout). One sentence, no "image of".
- caption: a short gallery caption (3-7 words) or empty string if the image speaks for itself.
- decorative: true for logos, tiny dividers, colour-swatch strips, or non-content graphics that should be hidden from the gallery; false for real content (looks, spreads, flats, photos).

Then for the project overall:
- title: a clean human title (strip any author name / "on Behance").
- coverIndex: the best COVER image index. Prefer a strong, roughly landscape-or-square image that crops well into a wide banner AND a portrait tile. AVOID ultra-wide thin strips (aspect ratio > 2.2) — they upscale and blur in grid thumbnails.
- category: one of exactly "Couture", "Ready-to-wear", "Textile", "Collaboration".
- role: the designer's role, e.g. "Design, textiles, embroidery".
- excerpt: one understated sentence describing the project.
- materials: a few real materials/techniques visible (fabrics, embroidery types).
- tags: 4-6 lowercase hyphenated tags.
- palette: 4-6 {name, hex} colours sampled from the actual imagery (accurate hexes).`;

const submitTool: Anthropic.Tool = {
  name: "submit_project",
  description: "Submit the drafted project metadata.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string" },
      coverIndex: { type: "integer" },
      category: {
        type: "string",
        enum: ["Couture", "Ready-to-wear", "Textile", "Collaboration"],
      },
      role: { type: "string" },
      excerpt: { type: "string" },
      materials: { type: "array", items: { type: "string" } },
      tags: { type: "array", items: { type: "string" } },
      palette: {
        type: "array",
        items: {
          type: "object",
          properties: { name: { type: "string" }, hex: { type: "string" } },
          required: ["name", "hex"],
        },
      },
      images: {
        type: "array",
        items: {
          type: "object",
          properties: {
            alt: { type: "string" },
            caption: { type: "string" },
            decorative: { type: "boolean" },
          },
          required: ["alt", "caption", "decorative"],
        },
      },
    },
    required: [
      "title",
      "coverIndex",
      "category",
      "role",
      "excerpt",
      "materials",
      "tags",
      "palette",
      "images",
    ],
  },
};

export type VisionImageInput = {
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  base64: string;
  width: number;
  height: number;
};

export type VisionImageMeta = {
  alt: string;
  caption: string;
  decorative: boolean;
};

export type VisionDraft = {
  title: string;
  coverIndex: number;
  category: "Couture" | "Ready-to-wear" | "Textile" | "Collaboration";
  role: string;
  excerpt: string;
  materials: string[];
  tags: string[];
  palette: { name: string; hex: string }[];
  images: VisionImageMeta[];
};

export function visionAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function draftMetadata(
  images: VisionImageInput[],
  ctx: { titleHint: string },
): Promise<VisionDraft> {
  const client = new Anthropic();

  const content: Anthropic.ContentBlockParam[] = [
    {
      type: "text",
      text: `Project title hint from Behance: "${ctx.titleHint}". ${images.length} images follow, in order, starting at index 0.`,
    },
  ];
  images.forEach((img, i) => {
    content.push({ type: "text", text: `Image ${i} (${img.width}x${img.height}):` });
    content.push({
      type: "image",
      source: { type: "base64", media_type: img.mediaType, data: img.base64 },
    });
  });

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    tools: [submitTool],
    tool_choice: { type: "tool", name: "submit_project" },
    messages: [{ role: "user", content }],
  });

  const block = msg.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") {
    throw new Error("Vision model did not return structured metadata.");
  }
  const draft = block.input as VisionDraft;

  // Align image metadata length defensively.
  if (!Array.isArray(draft.images) || draft.images.length !== images.length) {
    const fixed: VisionImageMeta[] = images.map((_, i) => ({
      alt: draft.images?.[i]?.alt ?? "",
      caption: draft.images?.[i]?.caption ?? "",
      decorative: draft.images?.[i]?.decorative ?? false,
    }));
    draft.images = fixed;
  }
  return draft;
}
