'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WorkingHoursCard() {
  const [workingHours, setWorkingHours] = useState(
    DAYS.map((day) => ({
      day,
      isActive: day !== 'Sunday',
      startTime: '09:00',
      endTime: '18:00'
    }))
  );
  
  const [isSaving, setIsSaving] = useState(false);

  const toggleDay = (index: number) => {
    const newHours = [...workingHours];
    newHours[index].isActive = !newHours[index].isActive;
    setWorkingHours(newHours);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Mock save since there's no DB table for base working hours yet.
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Working hours saved successfully! (Mocked)');
    }, 800);
  };

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-4 bg-surface-secondary/50">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-text-muted" />
          <h2 className="text-lg font-bold text-text">Weekly Working Hours</h2>
        </div>
        <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-text-muted border border-border">
          Recursive Schedule
        </span>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="mb-4 grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider text-text-muted hidden sm:grid">
          <div className="col-span-4">Day</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Start Time</div>
          <div className="col-span-3">End Time</div>
        </div>
        
        <div className="space-y-4">
          {workingHours.map((schedule, index) => (
            <div key={schedule.day} className="flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-4 py-3 border-b border-border last:border-0 last:pb-0">
              <div className="col-span-4 font-medium text-text">
                {schedule.day}
              </div>
              
              <div className="col-span-2">
                <button 
                  onClick={() => toggleDay(index)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    schedule.isActive ? 'bg-[#006064]' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    schedule.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {schedule.isActive ? (
                <>
                  <div className="col-span-3">
                    <input
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) => {
                        const newHours = [...workingHours];
                        newHours[index].startTime = e.target.value;
                        setWorkingHours(newHours);
                      }}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="col-span-3 relative">
                    <input
                      type="time"
                      value={schedule.endTime}
                      onChange={(e) => {
                        const newHours = [...workingHours];
                        newHours[index].endTime = e.target.value;
                        setWorkingHours(newHours);
                      }}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </>
              ) : (
                <div className="col-span-6 flex items-center justify-center rounded-lg bg-surface-secondary py-2 text-sm italic text-text-muted">
                  Day Off (Clinical Maintenance)
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-border bg-surface-secondary p-4 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg bg-[#006064] px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Working Hours'}
        </button>
      </div>
    </div>
  );
}
