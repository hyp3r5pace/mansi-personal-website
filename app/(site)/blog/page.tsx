import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllPosts } from "@/lib/mdx";
import { JournalBrowser } from "@/components/blog/JournalBrowser";

export const metadata: Metadata = {
  title: "Journal",
  description: "Process notes, mistakes worth remembering, and studio conversation.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-10 sm:py-24">
      <header className="mb-12">
        <p className="font-accent text-rose-madder text-2xl">studio notebook</p>
        <h1 className="font-display text-ink-indigo mt-2 text-5xl tracking-tight italic sm:text-6xl">
          Journal
        </h1>
        <p className="text-char-ink/70 mt-6 max-w-xl text-lg">
          Process notes, mistakes worth remembering, and the occasional
          interview with a craftsperson.
        </p>
      </header>

      <Suspense fallback={null}>
        <JournalBrowser posts={posts} />
      </Suspense>
    </main>
  );
}
