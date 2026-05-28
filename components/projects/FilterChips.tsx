"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";

type FilterChipsProps = {
  categories: string[];
  years: number[];
};

/**
 * URL-synced filter chips for the projects index. Two groups:
 * category and year. Clicking an active chip clears the param.
 * Updates happen via router.replace so back/forward still works.
 */
export function FilterChips({ categories, years }: FilterChipsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const activeCategory = params.get("category");
  const activeYear = params.get("year");

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null || next.get(key) === value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const hasFilter = !!activeCategory || !!activeYear;

  return (
    <div className="flex flex-col gap-4">
      <ChipGroup
        label="Category"
        items={categories}
        active={activeCategory}
        onToggle={(v) => setParam("category", v)}
      />
      <ChipGroup
        label="Year"
        items={years.map(String)}
        active={activeYear}
        onToggle={(v) => setParam("year", v)}
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
  active: string | null;
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-char-ink/55 mr-1 font-mono text-[10px] uppercase tracking-widest">
        {label}
      </span>
      {items.map((item) => {
        const isActive = active === item;
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
