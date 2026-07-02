import { SkeletonCard, SkeletonTable } from '@/components/dashboard/shared/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <SkeletonTable />
    </div>
  );
}
