'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { AppointmentWithPatient } from '@/types';
import { rescheduleAppointment } from '@/app/dashboard/appointments/actions';
import { format } from 'date-fns';

interface RescheduleModalProps {
  appointment: AppointmentWithPatient | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RescheduleModal({ appointment, isOpen, onClose, onSuccess }: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && appointment) {
      setSelectedDate(appointment.appointment_date);
      setReason('');
      setError(null);
    }
  }, [isOpen, appointment]);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchSlots = async (date: string) => {
    setIsFetchingSlots(true);
    setSelectedSlot('');
    try {
      const res = await fetch(`/api/appointments/available-slots?date=${date}`);
      if (!res.ok) throw new Error('Failed to fetch slots');
      const data = await res.json();
      setAvailableSlots(data.slots || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsFetchingSlots(false);
    }
  };

  const handleConfirm = async () => {
    if (!appointment || !selectedDate || !selectedSlot) return;
    
    setIsLoading(true);
    setError(null);

    // time format comes from API as "09:00", we need "09:00:00" and end time "10:00:00"
    const newStartTime = `${selectedSlot}:00`;
    const hour = parseInt(selectedSlot.split(':')[0], 10);
    const newEndTime = `${(hour + 1).toString().padStart(2, '0')}:00:00`;

    const result = await rescheduleAppointment(
      appointment.id, 
      selectedDate, 
      newStartTime, 
      newEndTime,
      reason || 'Doctor requested reschedule'
    );

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onSuccess();
      onClose();
    }
  };

  if (!isOpen || !appointment) return null;

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">Reschedule Appointment</h2>
          <button onClick={onClose} className="rounded-full p-2 text-text-muted hover:bg-surface-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Select New Date</label>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-text focus:border-[#006064] focus:outline-none focus:ring-1 focus:ring-[#006064]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text">Select Time Slot</label>
            {isFetchingSlots ? (
              <div className="flex h-10 items-center justify-center rounded-lg border border-border bg-surface text-sm text-text-muted">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching slots...
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="flex h-10 items-center justify-center rounded-lg border border-border bg-surface text-sm text-text-muted">
                No slots available on this date
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      selectedSlot === slot
                        ? 'border-[#006064] bg-[#006064] text-white'
                        : 'border-border bg-white text-text hover:bg-surface-secondary'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text">Reason for Reschedule (Optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Doctor is unavailable"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text focus:border-[#006064] focus:outline-none focus:ring-1 focus:ring-[#006064]"
              rows={2}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedSlot || isLoading}
            className="flex items-center justify-center rounded-lg bg-[#006064] px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}
