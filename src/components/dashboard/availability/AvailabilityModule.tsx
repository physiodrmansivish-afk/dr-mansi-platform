'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import WorkingHoursCard from './WorkingHoursCard';
import BlockDateCard from './BlockDateCard';
import AddTimeBlockCard from './AddTimeBlockCard';
import UpcomingOverridesCard from './UpcomingOverridesCard';
import { Info } from 'lucide-react';

interface BlockedSlot {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  reason: string | null;
}

interface AvailabilityModuleProps {
  initialBlockedSlots: BlockedSlot[];
}

export default function AvailabilityModule({ initialBlockedSlots }: AvailabilityModuleProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // We rely on Next.js server actions / revalidatePath to refresh data,
  // but we can also manage local optimistic state if needed. 
  // For simplicity and correctness, we'll trigger a router.refresh() when blocks are added/removed.
  const handleDataChanged = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">Manage Availability</h1>
          <p className="text-sm text-text-muted mt-1">Configure your recurring work hours and specific scheduling overrides.</p>
        </div>
        <button className="rounded-lg bg-[#006064] px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90">
          Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Weekly Working Hours */}
        <div className="lg:col-span-8">
          <WorkingHoursCard />
        </div>

        {/* Right Column: Overrides and Date Picker */}
        <div className="lg:col-span-4 space-y-6">
          <BlockDateCard 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <AddTimeBlockCard 
            selectedDate={selectedDate}
            onBlockAdded={handleDataChanged}
          />

          <UpcomingOverridesCard 
            blockedSlots={initialBlockedSlots}
            onBlockRemoved={handleDataChanged}
          />
        </div>
      </div>

      {/* Info Tip */}
      <div className="rounded-xl border border-border bg-surface-secondary p-4 flex gap-4 mt-8 max-w-4xl">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006064] text-white">
            <Info className="h-5 w-5" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-text">Scheduling Tip</h4>
          <p className="text-sm text-text-muted mt-1">
            Patients can only book appointments within your 'Working Hours' that haven't been 'Blocked'. We recommend updating your availability at least 2 weeks in advance to avoid last-minute cancellations.
          </p>
        </div>
      </div>
    </div>
  );
}
