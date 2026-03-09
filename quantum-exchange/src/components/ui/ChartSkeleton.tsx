import Skeleton, { SkeletonText } from "./Skeleton";

export default function ChartSkeleton() {
  return (
    <div className="flex flex-col h-full w-full bg-background p-3">
      {/* Chart toolbar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skeleton variant="rect" width={80} height={28} />
          <Skeleton variant="rect" width={60} height={28} />
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rect" width={32} height={28} />
          ))}
        </div>
      </div>

      {/* Main chart area */}
      <div className="flex-1 relative rounded-lg border border-border bg-surface/30 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 right-0 border-t border-border/20"
              style={{ top: `${(i + 1) * 20}%` }}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 border-l border-border/20"
              style={{ left: `${(i + 1) * 12.5}%` }}
            />
          ))}
        </div>

        {/* Fake candlesticks */}
        <div className="absolute inset-0 flex items-end justify-around px-4 pb-8">
          {Array.from({ length: 30 }).map((_, i) => {
            const height = Math.random() * 60 + 20;
            const isGreen = Math.random() > 0.5;
            return (
              <div
                key={i}
                className="flex flex-col items-center"
                style={{ height: `${height}%` }}
              >
                <div
                  className={`w-[2px] flex-1 ${isGreen ? "bg-accent/30" : "bg-danger/30"}`}
                />
                <div
                  className={`w-[6px] h-3 ${isGreen ? "bg-accent/50" : "bg-danger/50"} rounded-sm`}
                />
                <div
                  className={`w-[2px] flex-1 ${isGreen ? "bg-accent/30" : "bg-danger/30"}`}
                />
              </div>
            );
          })}
        </div>

        {/* Loading indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] text-muted">Loading chart...</span>
        </div>
      </div>

      {/* Bottom indicators */}
      <div className="mt-3 space-y-2">
        <Skeleton variant="rect" className="w-full h-16" />
        <Skeleton variant="rect" className="w-full h-12" />
      </div>
    </div>
  );
}

export function OrderBookSkeleton() {
  return (
    <div className="flex flex-col h-full w-full bg-background p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <SkeletonText lines={1} />
        <Skeleton variant="rect" width={60} height={24} />
      </div>

      {/* Asks (sells) */}
      <div className="flex-1 space-y-1 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between text-[10px]">
            <Skeleton variant="text" className="w-12 h-3" />
            <Skeleton variant="text" className="w-16 h-3" />
            <Skeleton variant="text" className="w-12 h-3" />
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className="py-2 my-2 border-y border-border">
        <div className="flex items-center justify-center gap-2">
          <Skeleton variant="text" className="w-16 h-4" />
          <Skeleton variant="text" className="w-12 h-4" />
        </div>
      </div>

      {/* Bids (buys) */}
      <div className="flex-1 space-y-1 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between text-[10px]">
            <Skeleton variant="text" className="w-12 h-3" />
            <Skeleton variant="text" className="w-16 h-3" />
            <Skeleton variant="text" className="w-12 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrderFormSkeleton() {
  return (
    <div className="w-full p-3 space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <Skeleton variant="rect" className="flex-1 h-9" />
        <Skeleton variant="rect" className="flex-1 h-9" />
      </div>

      {/* Order type selector */}
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rect" className="flex-1 h-7" />
        ))}
      </div>

      {/* Input fields */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton variant="text" className="w-16 h-3" />
            <div className="relative">
              <Skeleton variant="rect" className="w-full h-9" />
              <Skeleton variant="rect" className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <Skeleton variant="text" className="w-20 h-3" />
        <Skeleton variant="rect" className="w-full h-2" />
      </div>

      {/* Submit button */}
      <Skeleton variant="rect" className="w-full h-10" />

      {/* Order summary */}
      <div className="pt-3 border-t border-border space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton variant="text" className="w-20 h-3" />
            <Skeleton variant="text" className="w-16 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PairInfoSkeleton() {
  return (
    <div className="flex items-center gap-4 px-3 py-2 border-b border-border bg-background">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" className="w-20 h-5" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="hidden sm:block">
          <Skeleton variant="text" className="w-16 h-3 mb-1" />
          <Skeleton variant="text" className="w-20 h-4" />
        </div>
      ))}
    </div>
  );
}

export function MarketOverviewSkeleton() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton variant="text" className="w-40 h-7 mb-2" />
          <Skeleton variant="text" className="w-56 h-4" />
        </div>
        <Skeleton variant="rect" width={120} height={36} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rect" className="flex-1 h-9" />
        ))}
      </div>

      {/* Market cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <Skeleton variant="circular" width={32} height={32} />
              <div className="flex-1">
                <Skeleton variant="text" className="w-24 h-4 mb-1" />
                <Skeleton variant="text" className="w-16 h-3" />
              </div>
            </div>
            <Skeleton variant="text" className="w-28 h-6 mb-2" />
            <div className="flex items-center gap-2">
              <Skeleton variant="text" className="w-16 h-4" />
              <Skeleton
                variant="text"
                className={`w-20 h-4 ${i % 2 === 0 ? "bg-accent/20" : "bg-danger/20"}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
