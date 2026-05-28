import { cn } from "@/lib/cn";

type PaperSurfaceProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "paper" | "paper-deep" | "cotton" | "ink";
  as?: React.ElementType;
};

const TONE_CLASS: Record<NonNullable<PaperSurfaceProps["tone"]>, string> = {
  paper: "bg-paper text-char-ink",
  "paper-deep": "bg-paper-deep text-char-ink",
  cotton: "bg-cotton text-char-ink",
  ink: "bg-indigo-deep text-paper",
};

/**
 * Wrapper that applies a paper-toned background and the grain texture.
 * Use as a section container when you want the textured feel without
 * setting it globally.
 */
export function PaperSurface({
  children,
  className,
  tone = "paper",
  as: Tag = "section",
}: PaperSurfaceProps) {
  return <Tag className={cn("paper-grain", TONE_CLASS[tone], className)}>{children}</Tag>;
}
