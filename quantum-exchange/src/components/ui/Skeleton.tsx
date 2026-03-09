import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circular" | "rounded" | "text";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "shimmer" | "none";
}

export default function Skeleton({
  className,
  variant = "rect",
  width,
  height,
  animation = "shimmer",
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-surface",
        variant === "circular" && "rounded-full",
        variant === "rounded" && "rounded-lg",
        variant === "text" && "rounded h-4",
        variant === "rect" && "rounded-md",
        animation === "pulse" && "animate-pulse",
        animation === "shimmer" && "animate-shimmer",
        className
      )}
      style={{
        width,
        height,
      }}
    />
  );
}

// Pre-built skeleton variants for common use cases
export function SkeletonText({
  lines = 1,
  gap = "gap-2",
  className,
}: {
  lines?: number;
  gap?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", gap, className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            i === lines - 1 && "w-3/4",
            i === 0 && "w-full",
            lines > 1 && i > 0 && i < lines - 1 && "w-5/6"
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="flex items-center gap-3 mb-3">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="flex-1">
          <Skeleton variant="text" className="w-24 h-4 mb-1" />
          <Skeleton variant="text" className="w-16 h-3" />
        </div>
      </div>
      <Skeleton variant="rect" className="w-full h-20" />
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex gap-4 px-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-3 py-2 border-t border-border/30">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} variant="text" className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
