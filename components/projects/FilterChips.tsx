"use client";

import { useEffect, useRef, useState } from "react";
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
 * URL-synced filter chips for the projects index. Three groups: category,
 * year, and tag. Each is multi-select — clicking a chip toggles its
 * membership in a comma-separated param. Filtering is OR within a group, AND
 * across groups. The tag group collapses its long tail into a "more"
 * dropdown so it doesn't swamp the page. router.replace keeps back/forward.
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
        maxVisible={8}
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

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "stitch-border px-3 py-1 text-sm transition-colors",
        active
          ? "bg-ink-indigo text-paper border-ink-indigo"
          : "bg-paper text-ink-indigo hover:bg-paper-deep",
      )}
    >
      {label}
    </button>
  );
}

function ChipGroup({
  label,
  items,
  active,
  onToggle,
  maxVisible,
}: {
  label: string;
  items: string[];
  active: string[];
  onToggle: (v: string) => void;
  /** When set and exceeded, the overflow goes into a "more" dropdown. */
  maxVisible?: number;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (items.length === 0) return null;

  // Active items are always pinned to the visible row; the rest fill up to
  // maxVisible, and anything beyond goes into the dropdown.
  let visible = items;
  let hidden: string[] = [];
  if (maxVisible && items.length > maxVisible) {
    const pinned = items.filter((i) => active.includes(i));
    const rest = items.filter((i) => !active.includes(i));
    const fill = rest.slice(0, Math.max(0, maxVisible - pinned.length));
    visible = [...pinned, ...fill];
    hidden = rest.slice(fill.length);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-char-ink/55 mr-1 font-mono text-[10px] uppercase tracking-widest">
        {label}
      </span>
      {visible.map((item) => (
        <Chip
          key={item}
          label={item}
          active={active.includes(item)}
          onClick={() => onToggle(item)}
        />
      ))}

      {hidden.length > 0 ? (
        <div ref={wrapRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="stitch-border text-char-ink/70 hover:bg-paper-deep border-dashed px-3 py-1 text-sm transition-colors"
          >
            {open ? "fewer" : `+${hidden.length} more`}
          </button>
          {open ? (
            <div className="border-char-ink/20 bg-paper absolute left-0 z-20 mt-2 flex max-h-64 w-64 flex-wrap content-start gap-2 overflow-y-auto rounded-sm border p-3 shadow-lg sm:w-80">
              {hidden.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  active={active.includes(item)}
                  onClick={() => onToggle(item)}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
