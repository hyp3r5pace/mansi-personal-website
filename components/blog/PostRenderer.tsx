import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";
import { PullQuote } from "@/components/content/PullQuote";

/*
 * MDX renderer for blog posts.
 *
 * Differs from the case-study MdxRenderer in two ways:
 *   1. Remark GFM is loaded so footnote syntax ([^1]) compiles.
 *   2. The first paragraph gets a drop-cap via :first-of-type styling
 *      applied at the article wrapper (see app/(site)/blog/[slug]).
 *
 * Scope stays minimal — prose + PullQuote — for the same RSC
 * serialization reasons documented in the case-study renderer.
 */

const elementOverrides = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className={cn(
        "font-display text-ink-indigo mt-14 mb-5 text-3xl tracking-tight italic sm:text-4xl",
        props.className,
      )}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className={cn(
        "font-display text-ink-indigo mt-10 mb-4 text-2xl tracking-tight italic",
        props.className,
      )}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      {...props}
      className={cn(
        "text-char-ink/85 my-5 text-lg leading-relaxed",
        props.className,
      )}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} className={cn("text-ink-indigo font-semibold", props.className)} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em {...props} className={cn("font-display italic", props.className)} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      {...props}
      className={cn(
        "border-rose-madder/40 text-rose-madder font-display my-10 border-l-2 pl-6 text-2xl leading-snug italic",
        props.className,
      )}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className={cn("text-char-ink/85 my-5 list-disc space-y-2 pl-6 text-lg", props.className)} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className={cn("text-char-ink/85 my-5 list-decimal space-y-2 pl-6 text-lg", props.className)} />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr {...props} className={cn("border-char-ink/15 my-12 border-t border-dashed", props.className)} />
  ),
  a: ({ href = "#", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href.startsWith("/");
    const className = cn(
      "text-ink-indigo decoration-marigold underline decoration-2 underline-offset-4 transition-colors hover:text-marigold-deep",
      props.className,
    );
    return isInternal ? (
      <Link href={href} className={className}>
        {props.children}
      </Link>
    ) : (
      <a href={href} {...props} className={className} target="_blank" rel="noopener noreferrer" />
    );
  },
  section: (props: React.HTMLAttributes<HTMLElement>) => {
    // remark-gfm emits <section data-footnotes> for the footnote block.
    const isFootnotes =
      (props as { "data-footnotes"?: boolean })["data-footnotes"];
    return (
      <section
        {...props}
        className={cn(
          isFootnotes
            ? "text-char-ink/70 border-char-ink/15 mt-16 border-t border-dashed pt-8 text-sm [&_h2]:font-mono [&_h2]:text-[10px] [&_h2]:uppercase [&_h2]:tracking-widest [&_h2]:text-char-ink/55 [&_h2]:not-italic [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-sm [&_p]:my-1 [&_p]:text-sm"
            : undefined,
          props.className,
        )}
      />
    );
  },
};

const customComponents = {
  PullQuote,
};

export function PostRenderer({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={{ ...elementOverrides, ...customComponents }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      }}
    />
  );
}
