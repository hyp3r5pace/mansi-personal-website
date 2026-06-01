"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";

type TagFilterProps = {
  tags: string[];
};

/**
 * URL-synced tag chips for the journal index. Block-print style: dashed
 * stitch border, indigo fill on active. Clicking active chip clears it.
 */
export function TagFilter({ tags }: TagFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get("tag");

  function toggle(value: string) {
    const next = new URLSearchParams(params.toString());
    if (next.get("tag") === value) {
      next.delete("tag");
    } else {
      next.set("tag", value);
    }
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
        const isActive = active === tag;
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
      {active ? (
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
