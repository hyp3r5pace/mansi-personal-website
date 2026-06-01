"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";

type TagFilterProps = {
  tags: string[];
};

/** Parse a comma-separated multi-select param into a list of values. */
function parseList(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

/**
 * URL-synced tag chips for the journal index. Multi-select: each click
 * toggles a tag's membership in a comma-separated param (OR semantics).
 * Block-print style: dashed stitch border, indigo fill on active.
 */
export function TagFilter({ tags }: TagFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = parseList(params.get("tag"));

  function toggle(value: string) {
    const next = new URLSearchParams(params.toString());
    const current = parseList(next.get("tag"));
    const idx = current.indexOf(value);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(value);
    if (current.length) next.set("tag", current.join(","));
    else next.delete("tag");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-char-ink/55 mr-1 font-mono text-[10px] uppercase tracking-widest">
        Tags
      </span>
      {tags.map((tag) => {
        const isActive = active.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            aria-pressed={isActive}
            className={cn(
              "stitch-border px-3 py-1 text-sm transition-colors",
              isActive
                ? "bg-ink-indigo text-paper border-ink-indigo"
                : "bg-paper text-ink-indigo hover:bg-paper-deep",
            )}
          >
            {tag}
          </button>
        );
      })}
      {active.length > 0 ? (
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="text-char-ink/60 hover:text-marigold-deep ml-2 font-mono text-xs uppercase tracking-widest transition-colors"
        >
          clear
        </button>
      ) : null}
    </div>
  );
}
