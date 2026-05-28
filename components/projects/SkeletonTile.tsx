import { cn } from "@/lib/cn";

/**
 * Loading placeholder for a project tile. Dashed border pulses gently;
 * used in Suspense fallbacks once async data lands later.
 */
export function SkeletonTile({ className, ratio = "portrait" }: { className?: string; ratio?: "portrait" | "landscape" | "square" }) {
  const ratioClass = ratio === "portrait" ? "aspect-[3/4]" : ratio === "landscape" ? "aspect-[4/3]" : "aspect-square";
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        className={cn(
          "stitch-border bg-paper-deep relative w-full overflow-hidden rounded-sm",
          ratioClass,
        )}
      >
        <div className="from-paper-deep via-paper to-paper-deep absolute inset-0 -translate-x-full animate-[skeleton-sweep_1.8s_ease-in-out_infinite] bg-gradient-to-r" />
      </div>
      <div className="bg-paper-deep h-3 w-1/3 rounded-sm" />
      <div className="bg-paper-deep h-5 w-2/3 rounded-sm" />
      <style>{`
        @keyframes skeleton-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[skeleton-sweep_1\\.8s_ease-in-out_infinite\\] { animation: none; }
        }
      `}</style>
    </div>
  );
}
