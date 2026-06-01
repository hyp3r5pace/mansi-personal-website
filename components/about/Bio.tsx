import { MDXRemote } from "next-mdx-remote/rsc";
import { cn } from "@/lib/cn";

/**
 * Minimal MDX renderer for the about-page bio. Only prose elements;
 * structured blocks (timeline, currently, press) come from frontmatter
 * and render at the page level.
 */
const elementOverrides = {
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      {...props}
      className={cn(
        "text-char-ink/85 my-4 max-w-prose text-lg leading-relaxed",
        props.className,
      )}
    />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em {...props} className={cn("font-display italic", props.className)} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} className={cn("text-ink-indigo font-semibold", props.className)} />
  ),
};

export function Bio({ source }: { source: string }) {
  return <MDXRemote source={source} components={elementOverrides} />;
}
