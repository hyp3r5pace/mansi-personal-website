/**
 * Single source of truth for the canonical site URL and basic metadata
 * used by feed generators (sitemap, RSS) and OG defaults.
 *
 * Override via NEXT_PUBLIC_SITE_URL at build time once the production
 * domain is known.
 */
export const SITE = {
  url:
    (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bubu.studio").replace(
      /\/$/,
      "",
    ),
  name: "Bubu — Studio",
  description:
    "A working studio for craft-led fashion. Process notes, projects, and the occasional conversation.",
  author: "Bubu",
};
