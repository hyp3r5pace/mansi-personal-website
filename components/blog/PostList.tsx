import Link from "next/link";
import type { BlogPost } from "@/lib/mdx";

type PostListProps = {
  posts: BlogPost[];
};

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * Editorial list — date, title, excerpt — stacked rows separated by a
 * dashed hairline. Title underline animates on hover (marigold band).
 */
export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-char-ink/60 stitch-border bg-paper-deep my-12 flex items-center justify-center p-12 text-center text-sm">
        <p className="font-display text-xl italic">
          Nothing under that tag yet — try another.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-char-ink/15 divide-y divide-dashed">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`} className="group block py-8 sm:py-10">
            <div className="grid gap-6 sm:grid-cols-[10rem_1fr] sm:gap-10">
              <div className="text-char-ink/65 font-mono text-xs uppercase tracking-widest sm:text-right">
                <time dateTime={post.date.toISOString()}>
                  {dateFmt.format(post.date)}
                </time>
                <span className="text-char-ink/45 mx-2 sm:hidden">·</span>
                <span className="sm:mt-1 sm:block">
                  {post.readingMinutes} min read
                </span>
              </div>
              <div>
                <h2 className="font-display text-ink-indigo text-3xl tracking-tight italic sm:text-4xl">
                  <span className="bg-marigold bg-no-repeat bg-[length:0%_2px] bg-[position:0_100%] pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                    {post.title}
                  </span>
                </h2>
                <p className="text-char-ink/75 mt-3 max-w-prose text-lg leading-relaxed">
                  {post.excerpt}
                </p>
                {post.tags.length > 0 ? (
                  <p className="text-char-ink/55 mt-4 font-mono text-[10px] uppercase tracking-widest">
                    {post.tags.join(" · ")}
                  </p>
                ) : null}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
