"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { TagFilter } from "./TagFilter";
import { PostList } from "./PostList";
import type { BlogPost } from "@/lib/mdx";

type JournalBrowserProps = {
  posts: BlogPost[];
};

/**
 * Server-static index with URL-synced tag filter. Full post list ships
 * once; toggling a tag is a re-render off searchParams.
 */
export function JournalBrowser({ posts }: JournalBrowserProps) {
  const params = useSearchParams();
  const tagParam = params.get("tag");

  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts],
  );

  const filtered = useMemo(() => {
    const selected = tagParam ? tagParam.split(",").filter(Boolean) : [];
    if (!selected.length) return posts;
    // AND within the tag group: show posts matching every selected tag.
    return posts.filter((p) => selected.every((t) => p.tags.includes(t)));
  }, [posts, tagParam]);

  return (
    <div className="space-y-10">
      <TagFilter tags={tags} />
      <PostList posts={filtered} />
    </div>
  );
}
