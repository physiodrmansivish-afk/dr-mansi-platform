'use client';

import { X, Clock } from 'lucide-react';
import { format, parse } from 'date-fns';
import { useState } from 'react';

interface BlockedSlot {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  reason: string | null;
}

interface UpcomingOverridesCardProps {
  blockedSlots: BlockedSlot[];
  onBlockRemoved: () => void;
}

export default function UpcomingOverridesCard({ blockedSlots, onBlockRemoved }: UpcomingOverridesCardProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/availability/block/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onBlockRemoved();
      }
    } catch (err) {
      console.error('Failed to delete block:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm flex flex-col">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-lg font-bold text-text">Upcoming Overrides</h2>
        <span className="rounded bg-surface-secondary px-2 py-1 text-xs font-bold text-text-muted">
          {blockedSlots.length} ACTIVE
        </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-h-[300px] space-y-3">
        {blockedSlots.length === 0 ? (
          <p className="text-center text-sm text-text-muted mt-8">No overrides configured.</p>
        ) : (
          blockedSlots.map((slot) => {
            const dateStr = format(parse(slot.slot_date, 'yyyy-MM-dd', new Date()), 'MMM dd');
            const startStr = format(parse(slot.start_time, 'HH:mm:ss', new Date()), 'hh:mm a');
            const endStr = format(parse(slot.end_time, 'HH:mm:ss', new Date()), 'hh:mm a');
            
            // Check if it's a full day block (e.g. 09:00 to 18:00)
            const isFullDay = slot.start_time === '09:00:00' && slot.end_time === '18:00:00';

            return (
              <div key={slot.id} className="relative flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text">
                    {dateStr}: {isFullDay ? 'Full Day' : `${startStr} - ${endStr}`}
                  </span>
                  <span className="text-xs text-text-muted mt-0.5">
                    Reason: {slot.reason || 'Not specified'}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(slot.id)}
                  disabled={deletingId === slot.id}
                  className="rounded p-1 text-text-muted hover:bg-white hover:text-red-500 disabled:opacity-50"
                  title="Remove block"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-border p-3 text-center">
        <button className="text-xs font-semibold text-[#006064] hover:underline flex items-center justify-center gap-1 w-full">
          <Clock className="h-3.5 w-3.5" />
          View Past Blocks
        </button>
      </div>
    </div>
  );
}
