"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";

type FilterChipsProps = {
  categories: string[];
  years: number[];
  tags: string[];
};

/** Parse a comma-separated multi-select param into a list of values. */
function parseList(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

/**
 * URL-synced filter chips for the projects index. Three groups:
 * category, year, and tag. Each group is multi-select — clicking a chip
 * toggles its membership in a comma-separated param. Filtering is OR
 * within a group, AND across groups. router.replace keeps back/forward.
 */
export function FilterChips({ categories, years, tags }: FilterChipsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const activeCategories = parseList(params.get("category"));
  const activeYears = parseList(params.get("year"));
  const activeTags = parseList(params.get("tag"));

  function toggleParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    const current = parseList(next.get(key));
    const idx = current.indexOf(value);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(value);
    if (current.length) next.set(key, current.join(","));
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const hasFilter =
    activeCategories.length > 0 ||
    activeYears.length > 0 ||
    activeTags.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <ChipGroup
        label="Category"
        items={categories}
        active={activeCategories}
        onToggle={(v) => toggleParam("category", v)}
      />
      <ChipGroup
        label="Year"
        items={years.map(String)}
        active={activeYears}
        onToggle={(v) => toggleParam("year", v)}
      />
      <ChipGroup
        label="Tag"
        items={tags}
        active={activeTags}
        onToggle={(v) => toggleParam("tag", v)}
      />
      {hasFilter ? (
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="text-char-ink/60 hover:text-marigold-deep self-start font-mono text-xs uppercase tracking-widest transition-colors"
        >
          clear filters
        </button>
      ) : null}
    </div>
  );
}

function ChipGroup({
  label,
  items,
  active,
  onToggle,
}: {
  label: string;
  items: string[];
  active: string[];
  onToggle: (v: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-char-ink/55 mr-1 font-mono text-[10px] uppercase tracking-widest">
        {label}
      </span>
      {items.map((item) => {
        const isActive = active.includes(item);
        return (
          <button
            key={item}
            type="button"
            onClick={() => onToggle(item)}
            aria-pressed={isActive}
            className={cn(
              "stitch-border px-3 py-1 text-sm transition-colors",
              isActive
                ? "bg-ink-indigo text-paper border-ink-indigo"
                : "bg-paper text-ink-indigo hover:bg-paper-deep",
            )}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
