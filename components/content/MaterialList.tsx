import { cn } from "@/lib/cn";

type MaterialListProps = {
  items: string[];
  title?: string;
  className?: string;
};

/**
 * Compact two-column list used for materials, collaborators, or any
 * short structured set in a case study. Title sits in the left rail.
 */
export function MaterialList({ items, title = "Materials", className }: MaterialListProps) {
  return (
    <dl className={cn("border-char-ink/12 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 border-y py-6", className)}>
      <dt className="text-char-ink/60 font-mono text-[11px] uppercase tracking-widest">
        {title}
      </dt>
      <dd>
        <ul className="font-display text-ink-indigo space-y-1 text-lg italic">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </dd>
    </dl>
  );
}
