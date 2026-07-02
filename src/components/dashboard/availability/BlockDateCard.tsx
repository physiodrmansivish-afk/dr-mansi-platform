'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlockDateCardProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

export default function BlockDateCard({ selectedDate, onSelectDate }: BlockDateCardProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2 border-b border-border pb-4">
        <h2 className="text-lg font-bold text-text">Block Date Ranges</h2>
      </div>
      
      <style>{`
        .rdp { --rdp-cell-size: 36px; margin: 0; }
        .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
          background-color: #E0F2F1;
          color: #006064;
          font-weight: bold;
        }
      `}</style>

      <div className="py-4">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          showOutsideDays
          className="mx-auto"
        />
      </div>

      <div className="w-full flex items-center justify-between mt-4 pt-4 border-t border-border text-sm">
        <span className="text-text-muted">
          Selected: <strong className="text-[#006064]">{selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'None'}</strong>
        </span>
        {selectedDate && (
          <button 
            onClick={() => onSelectDate(undefined)}
            className="text-text-muted font-medium hover:text-text"
          >
            Clear Selection
          </button>
        )}
      </div>
    </div>
  );
}
