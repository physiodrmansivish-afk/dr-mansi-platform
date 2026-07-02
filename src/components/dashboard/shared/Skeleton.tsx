export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-surface-secondary ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <Skeleton className="h-4 w-1/3 mb-4" />
      <Skeleton className="h-10 w-1/2 mb-4" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm p-6">
      <div className="flex justify-between mb-6">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
