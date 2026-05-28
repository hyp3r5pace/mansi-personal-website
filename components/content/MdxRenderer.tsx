import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { PullQuote } from "./PullQuote";

/*
 * NOTE — MDX scope is intentionally minimal.
 *
 * Authors compose case studies as prose plus PullQuote. Structured
 * blocks (mood boards, process rows, palettes, materials lists) are
 * authored in the project frontmatter and rendered at the page level.
 *
 * Reason: under next-mdx-remote@6 + Next 16 / Turbopack, complex JSX
 * expression props in MDX (arrays of objects in particular) evaluate
 * to undefined inside the RSC payload, crashing components that try
 * to iterate them. Page-level rendering avoids that path entirely.
 */

const elementOverrides = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      {...props}
      className={cn(
        "font-display text-ink-indigo mt-16 mb-6 text-4xl tracking-tight italic sm:text-5xl",
        props.className,
      )}
    />
  ),
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
      className={cn("text-char-ink/85 my-5 max-w-prose text-lg leading-relaxed", props.className)}
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
};

/**
 * Only takes string/primitive props — safe with MDX scalar attrs.
 */
const customComponents = {
  PullQuote,
};

export function MdxRenderer({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={{ ...elementOverrides, ...customComponents }}
    />
  );
}
