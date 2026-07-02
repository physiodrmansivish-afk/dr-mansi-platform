import { SkeletonTable } from '@/components/dashboard/shared/Skeleton';

export default function AppointmentsLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in">
      <SkeletonTable />
    </div>
  );
}
