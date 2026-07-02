'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface AddTimeBlockCardProps {
  selectedDate: Date | undefined;
  onBlockAdded: () => void;
}

export default function AddTimeBlockCard({ selectedDate, onBlockAdded }: AddTimeBlockCardProps) {
  const [reason, setReason] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedDate) {
      setError('Please select a date from the calendar first.');
      return;
    }
    if (!startTime || !endTime) {
      setError('Please specify both start and end times.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/availability/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: format(selectedDate, 'yyyy-MM-dd'),
          startTime,
          endTime,
          reason
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to block time');
      }

      setReason('');
      setStartTime('');
      setEndTime('');
      onBlockAdded();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
        <CalendarIcon className="h-5 w-5 text-[#006064]" />
        <h2 className="text-lg font-bold text-text">Add Time Block</h2>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-text-muted">Reason for Blocking</label>
          <input
            type="text"
            placeholder="e.g. Personal Appointment, Surgery..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-text-muted">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-text-muted">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedDate}
          className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#006064] px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm Block
        </button>
        {!selectedDate && (
          <p className="mt-1 text-center text-xs text-text-muted">Select a date first</p>
        )}
      </div>
    </div>
  );
}
