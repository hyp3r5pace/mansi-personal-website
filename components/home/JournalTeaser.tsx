import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { ScribbleArrow } from "@/components/motion/ScribbleArrow";

export async function JournalTeaser() {
  const posts = (await getAllPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
      <header className="mb-12 flex items-end justify-between gap-6">
        <div>
          <p className="font-accent text-rose-madder text-2xl">studio notebook</p>
          <h2 className="font-display text-ink-indigo mt-2 text-4xl tracking-tight italic sm:text-5xl">
            From the journal
          </h2>
        </div>
        <Link
          href="/blog"
          className="text-ink-indigo hover:text-marigold-deep group hidden items-center gap-2 text-sm font-medium transition-colors sm:inline-flex"
        >
          All posts
          <ScribbleArrow className="h-3 w-8 transition-transform group-hover:translate-x-1" />
        </Link>
      </header>

      <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {posts.map((post) => {
          const date = post.date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          return (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <div className="border-char-ink/10 ring-char-ink/0 group-hover:ring-marigold-deep group-hover:-translate-y-1 aspect-[5/4] w-full overflow-hidden rounded-sm border bg-paper-deep paper-grain ring-1 transition-all duration-500" />
                <p className="font-accent text-rose-madder mt-3 text-lg">
                  {date}
                </p>
                <h3 className="font-display text-ink-indigo mt-1 text-xl tracking-tight italic">
                  <span className="bg-marigold bg-no-repeat bg-[length:0%_2px] bg-[position:0_100%] pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                    {post.title}
                  </span>
                </h3>
                <p className="text-char-ink/70 mt-2 line-clamp-2 text-sm">
                  {post.excerpt}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
