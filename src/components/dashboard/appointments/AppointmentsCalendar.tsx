'use client';

import { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth, isSameDay, addMonths, subMonths, parse } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AppointmentWithPatient } from '@/types';

interface AppointmentsCalendarProps {
  appointments: AppointmentWithPatient[];
  onView: (appt: AppointmentWithPatient) => void;
}

export default function AppointmentsCalendar({ appointments, onView }: AppointmentsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayAppointments = (day: Date) => {
    return appointments.filter(appt => {
      const apptDate = parse(appt.appointment_date, 'yyyy-MM-dd', new Date());
      return isSameDay(day, apptDate);
    });
  };

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-lg font-bold text-text">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="rounded-lg border border-border p-2 text-text hover:bg-surface-secondary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="rounded-lg border border-border p-2 text-text hover:bg-surface-secondary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-border bg-surface-secondary">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="p-3 text-center text-xs font-semibold uppercase text-text-muted">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr bg-border gap-px">
        {days.map((day, idx) => {
          const dayAppts = getDayAppointments(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={day.toISOString()} 
              className={`min-h-[120px] bg-white p-2 ${!isCurrentMonth ? 'opacity-50 bg-gray-50' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${isToday ? 'bg-[#006064] text-white font-bold' : 'text-text font-medium'}`}>
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="mt-2 space-y-1">
                {dayAppts.map(appt => (
                  <button
                    key={appt.id}
                    onClick={() => onView(appt)}
                    className="block w-full truncate rounded bg-blue-50 px-1.5 py-1 text-left text-xs font-medium text-blue-700 hover:bg-blue-100"
                    title={`${format(parse(appt.start_time, 'HH:mm:ss', new Date()), 'h:mm a')} - ${appt.patient.full_name}`}
                  >
                    {format(parse(appt.start_time, 'HH:mm:ss', new Date()), 'h:mm a')} {appt.patient.full_name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
