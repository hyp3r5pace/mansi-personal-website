import { cn } from "@/lib/cn";

type StitchBorderProps = {
  children?: React.ReactNode;
  className?: string;
  color?: string;
  weight?: number;
  dashLength?: number;
  gapLength?: number;
  radius?: number;
  inset?: boolean;
};

export function StitchBorder({
  children,
  className,
  color = "currentColor",
  weight = 1.5,
  dashLength = 6,
  gapLength = 5,
  radius = 4,
  inset = false,
}: StitchBorderProps) {
  return (
    <div className={cn("relative", className)}>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx={radius}
          ry={radius}
          fill="none"
          stroke={color}
          strokeWidth={weight}
          strokeDasharray={`${dashLength} ${gapLength}`}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {children ? <div className={cn("relative", inset && "p-3")}>{children}</div> : null}
    </div>
  );
}
