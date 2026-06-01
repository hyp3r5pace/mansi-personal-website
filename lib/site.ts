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

/** Default greeting pre-filled into the WhatsApp chat. */
const WHATSAPP_GREETING =
  "Hi Bubu — I came from your studio site and wanted to ask about…";

/**
 * Build a click-to-chat WhatsApp URL, or null if no number is configured.
 *
 * NEXT_PUBLIC_WHATSAPP_NUMBER must be E.164 digits without the leading "+"
 * (e.g. "919876543210"). Any stray spaces/dashes/plus are stripped so the
 * link stays valid even if the env value is formatted for humans.
 */
export function whatsappUrl(message: string = WHATSAPP_GREETING): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const number = raw?.replace(/[^\d]/g, "");
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
