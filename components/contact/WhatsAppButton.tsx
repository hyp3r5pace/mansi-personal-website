import { whatsappUrl } from "@/lib/site";

/**
 * Click-to-chat WhatsApp Business button for the contact sidebar.
 *
 * Plain anchor (no client JS). Renders nothing when
 * NEXT_PUBLIC_WHATSAPP_NUMBER is unset so the page degrades gracefully.
 * Styled in the site's craft palette (leaf-green accent) rather than
 * WhatsApp brand green to stay cohesive with the rest of the page.
 */
export function WhatsAppButton() {
  const href = whatsappUrl();
  if (!href) return null;

  return (
    <div className="flex flex-col gap-2">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with the studio on WhatsApp (opens in a new tab)"
        className="group border-leaf-green/40 text-ink-indigo hover:bg-leaf-green hover:border-leaf-green hover:text-cotton focus-visible:bg-leaf-green focus-visible:text-cotton flex w-full items-center justify-center gap-3 rounded-sm border bg-cotton px-5 py-3.5 font-medium transition-colors"
      >
        <WhatsAppGlyph className="text-leaf-green group-hover:text-cotton h-5 w-5 shrink-0 transition-colors" />
        Chat on WhatsApp
      </a>
      <p className="text-char-ink/55 text-center font-mono text-[10px] uppercase tracking-widest">
        Fastest reply — usually same day
      </p>
    </div>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      className={className}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24Zm-3.5 4.43c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43 1.02 2.6.13.16 1.76 2.68 4.27 3.76.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29-.25-.12-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12-.17.25-.65.8-.79.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.38-1.73-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43-.14 0-.31-.01-.48-.01Z" />
    </svg>
  );
}
