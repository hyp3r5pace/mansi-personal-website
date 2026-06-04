"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FilterChips } from "./FilterChips";
import { ProjectsGrid } from "./ProjectsGrid";
import type { Project } from "@/lib/mdx";

type ProjectsBrowserProps = {
  projects: Project[];
};

/**
 * Client-side filter + grid composition. Keeps the page server-static
 * by doing all filtering off the URL search params in the browser.
 * The full project list ships in the HTML once; user toggles cost
 * nothing more than a re-render.
 */
/** Parse a comma-separated multi-select param into a list of values. */
function parseList(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

export function ProjectsBrowser({ projects }: ProjectsBrowserProps) {
  const params = useSearchParams();
  const categoryParam = params.get("category");
  const yearParam = params.get("year");
  const tagParam = params.get("tag");

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))).sort(),
    [projects],
  );
  const years = useMemo(
    () => Array.from(new Set(projects.map((p) => p.year))).sort((a, b) => b - a),
    [projects],
  );
  // Most-used tags first (then alphabetical) so the visible few are the
  // most useful; the long tail goes into the "more" dropdown.
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects)
      for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([t]) => t);
  }, [projects]);

  const filtered = useMemo(() => {
    const cats = parseList(categoryParam);
    const yrs = parseList(yearParam);
    const tgs = parseList(tagParam);
    // AND everywhere: an item must match every selected value. Since a
    // project has a single category/year, selecting two of either yields
    // no matches by design.
    return projects.filter((p) => {
      if (cats.length && !cats.every((c) => p.category === c)) return false;
      if (yrs.length && !yrs.every((y) => String(p.year) === y)) return false;
      if (tgs.length && !tgs.every((t) => p.tags.includes(t))) return false;
      return true;
    });
  }, [projects, categoryParam, yearParam, tagParam]);

  return (
    <div className="space-y-12">
      <FilterChips categories={categories} years={years} tags={tags} />
      <ProjectsGrid projects={filtered} />
    </div>
  );
}
