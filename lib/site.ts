/**
 * Single source of truth for all configurable site text.
 *
 * Anything brand-, contact-, or copy-related that appears across the site
 * lives here so it can be changed in one place. Components and metadata
 * read from `SITE`; nothing user-facing should hardcode the studio name,
 * email, handles, or taglines.
 *
 * Override the canonical URL via NEXT_PUBLIC_SITE_URL at build time once
 * the production domain is known.
 */

const EMAIL = "hello@example.com";

/** Default greeting pre-filled into the WhatsApp chat. */
const WHATSAPP_GREETING =
  "Hi Mansi — I came from your studio site and wanted to ask about…";

export const SITE = {
  // ── Canonical URL ──────────────────────────────────────────────
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mansi.studio").replace(
    /\/$/,
    "",
  ),

  // ── Identity ───────────────────────────────────────────────────
  /** Studio name used in metadata, manifest, and feed titles. */
  name: "Mansi — Studio",
  /** Short brand name for compact contexts (manifest, OG footer). */
  shortName: "Mansi",
  /** Wordmark rendered in the nav and hero. */
  wordmark: "Mansi",
  /** Person's name for authorship / structured data. */
  author: "Mansi",
  /** Professional role; pairs with the name in page titles. */
  role: "Fashion Designer",
  /** One-line site description for meta + feeds. */
  description:
    "A working studio for craft-led fashion. Process notes, projects, and the occasional conversation.",
  /** Longer description used for SEO meta + structured data. */
  seoDescription:
    "Fashion and textile designer based in New Delhi — craft-led collections in handloom, aari and banjara embroidery, jamdani, and block print.",
  /** Meta keywords for search engines. */
  keywords: [
    "fashion designer",
    "textile designer",
    "handloom",
    "aari embroidery",
    "jamdani",
    "block print",
    "Indian craft",
    "New Delhi",
  ],

  // ── Brand copy ─────────────────────────────────────────────────
  /** Hero blurb under the wordmark. */
  tagline:
    "Textile-led fashion designer. A practice rooted in block print, kantha, and the slow weight of considered cloth.",
  /** Footer copyright suffix (year is prepended automatically). */
  copyrightLine: "Drawn, dyed, and stitched in India.",
  /** Headline + subhead rendered on the home Open Graph image. */
  ogHeadline: "Textile-led fashion, made slowly.",
  ogSubhead: "Block print, kantha, natural dye. New Delhi.",

  // ── Location ───────────────────────────────────────────────────
  location: {
    /** Short label, e.g. shown as a hero eyebrow. */
    eyebrow: "new delhi",
    /** Full sentence shown on the contact page. */
    line: "Based in Delhi — open to travel.",
  },

  // ── Contact ────────────────────────────────────────────────────
  email: EMAIL,
  /** External profiles. Email is handled separately via `email`. */
  socials: [
    { label: "Instagram", handle: "@mansi.studio", href: "https://instagram.com/" },
    { label: "Behance", handle: "mansi", href: "https://behance.net/" },
    { label: "LinkedIn", handle: "mansi", href: "https://linkedin.com/" },
  ],
  whatsappGreeting: WHATSAPP_GREETING,
} as const;

/**
 * Page- and section-level copy. Grouped by where it appears. Eyebrows are
 * the small script labels above headings; intros are the lede paragraphs.
 * Edit here to retune the site's voice without touching components.
 */
export const COPY = {
  hero: {
    ctaPrimary: "See the work",
    ctaSecondary: "About the maker",
    caption: "studio · march",
    imageTitle: "A hand on the cloth.",
  },
  featured: {
    eyebrow: "selected work",
    heading: "Recent projects",
    link: "All projects",
  },
  aboutTeaser: {
    eyebrow: "about",
    heading: "The hand makes the cloth, the cloth makes the piece.",
    body: "Trained in Delhi, working across small craft clusters in Rajasthan and Bengal. The studio runs at the speed of the cloth — most collections take six to nine months from first sketch to final piece.",
    link: "More about me",
    imageTitle: "Portrait, with thread.",
  },
  journalTeaser: {
    eyebrow: "studio notebook",
    heading: "From the journal",
    link: "All posts",
  },
  footer: {
    eyebrow: "let's make something",
    prompt: "Have a project in mind?",
    cta: "Tell me about it",
  },
  projectsPage: {
    eyebrow: "the work",
    heading: "Projects",
    intro:
      "Selected projects, capsules, and textile collaborations. Filter by category, year, or tag — combine as many as you like.",
  },
  blogPage: {
    eyebrow: "studio notebook",
    heading: "Journal",
    intro:
      "Process notes, mistakes worth remembering, and the occasional interview with a craftsperson.",
  },
  contactPage: {
    eyebrow: "say hello",
    heading: "Send a note",
    intro:
      "Commissions, collaborations, press, or a studio visit — write a few lines below and I’ll reply within a week.",
    directHeading: "Direct",
  },
} as const;

/** Bare domain without protocol, for display (e.g. "mansi.studio"). */
export const SITE_DOMAIN = SITE.url.replace(/^https?:\/\//, "");

/** Default `<title>` ("Mansi — Fashion Designer"). */
export const TITLE_DEFAULT = `${SITE.author} — ${SITE.role}`;
/** Title template for inner pages ("%s · Mansi"). */
export const TITLE_TEMPLATE = `%s · ${SITE.shortName}`;

/**
 * Build a click-to-chat WhatsApp URL, or null if no number is configured.
 *
 * NEXT_PUBLIC_WHATSAPP_NUMBER must be E.164 digits without the leading "+"
 * (e.g. "919876543210"). Any stray spaces/dashes/plus are stripped so the
 * link stays valid even if the env value is formatted for humans.
 */
export function whatsappUrl(
  message: string = SITE.whatsappGreeting,
): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const number = raw?.replace(/[^\d]/g, "");
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
