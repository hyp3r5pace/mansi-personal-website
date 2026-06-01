import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { SITE } from "@/lib/site";
import { PostRenderer } from "@/components/blog/PostRenderer";
import { ScribbleArrow } from "@/components/motion/ScribbleArrow";

type RouteParams = { slug: string };

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateStaticParams(): Promise<RouteParams[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      publishedTime: post.date.toISOString(),
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const all = await getAllPosts();
  const currentIndex = all.findIndex((p) => p.slug === post.slug);
  const next = all[currentIndex + 1] ?? null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: "Bubu" },
    datePublished: post.date.toISOString(),
    keywords: post.tags.join(", "),
    inLanguage: "en",
    url: `${SITE.url}/blog/${post.slug}`,
    wordCount: post.body.split(/\s+/).length,
  };

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="mx-auto w-full max-w-3xl px-6 pt-16 pb-10 sm:px-10 sm:pt-24 sm:pb-12">
        <Link
          href="/blog"
          className="text-char-ink/60 hover:text-marigold-deep group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-colors"
        >
          <ScribbleArrow direction="left" className="h-3 w-8 transition-transform group-hover:-translate-x-1" />
          All journal entries
        </Link>

        {post.tags.length > 0 ? (
          <p className="text-char-ink/60 mt-10 font-mono text-[10px] uppercase tracking-widest">
            {post.tags.join(" · ")}
          </p>
        ) : null}

        <h1 className="font-display text-ink-indigo mt-3 text-4xl leading-tight tracking-tight italic sm:text-6xl">
          {post.title}
        </h1>

        <div className="text-char-ink/65 mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-widest">
          <time dateTime={post.date.toISOString()}>{dateFmt.format(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
      </header>

      <article className="drop-cap mx-auto w-full max-w-[70ch] px-6 pb-16 sm:px-10 sm:pb-24">
        <PostRenderer source={post.body} />
      </article>

      {next ? (
        <aside className="bg-paper-deep border-char-ink/15 border-t border-dashed">
          <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-10 sm:py-16">
            <p className="text-char-ink/55 font-mono text-[10px] uppercase tracking-widest">
              Next entry
            </p>
            <Link href={`/blog/${next.slug}`} className="group mt-2 block">
              <h2 className="font-display text-ink-indigo text-3xl tracking-tight italic sm:text-4xl">
                <span className="bg-marigold bg-no-repeat bg-[length:0%_2px] bg-[position:0_100%] pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                  {next.title}
                </span>
              </h2>
              <p className="text-char-ink/70 mt-3 max-w-prose">{next.excerpt}</p>
            </Link>
          </div>
        </aside>
      ) : null}
    </main>
  );
}
