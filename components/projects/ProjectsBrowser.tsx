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
export function ProjectsBrowser({ projects }: ProjectsBrowserProps) {
  const params = useSearchParams();
  const category = params.get("category");
  const year = params.get("year");

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))).sort(),
    [projects],
  );
  const years = useMemo(
    () => Array.from(new Set(projects.map((p) => p.year))).sort((a, b) => b - a),
    [projects],
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (category && p.category !== category) return false;
      if (year && String(p.year) !== year) return false;
      return true;
    });
  }, [projects, category, year]);

  return (
    <div className="space-y-12">
      <FilterChips categories={categories} years={years} />
      <ProjectsGrid projects={filtered} />
    </div>
  );
}
