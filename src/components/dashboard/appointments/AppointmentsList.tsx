'use client';

import { format, parse } from 'date-fns';
import { Eye, Calendar, Trash2 } from 'lucide-react';
import type { AppointmentWithPatient } from '@/types';

interface AppointmentsListProps {
  appointments: AppointmentWithPatient[];
  onView: (appt: AppointmentWithPatient) => void;
  onReschedule: (appt: AppointmentWithPatient) => void;
  onCancel: (appt: AppointmentWithPatient) => void;
}

export default function AppointmentsList({
  appointments,
  onView,
  onReschedule,
  onCancel
}: AppointmentsListProps) {
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getStatusBadge = (status: string, paymentStatus: string) => {
    // Determine combined status badge. 
    // Usually if status='booked' and payment='paid', it's Confirmed.
    let badgeText = status.toUpperCase();
    let bg = 'bg-gray-100 text-gray-700';

    if (status === 'booked') {
      if (paymentStatus === 'paid') {
        badgeText = 'CONFIRMED';
        bg = 'bg-green-200 text-green-800';
      } else {
        badgeText = 'PENDING';
        bg = 'bg-gray-200 text-gray-700';
      }
    } else if (status === 'completed') {
      bg = 'bg-gray-300 text-gray-800';
    } else if (status === 'cancelled') {
      bg = 'bg-red-200 text-red-800';
    } else if (status === 'rescheduled') {
      bg = 'bg-orange-200 text-orange-800';
    } else if (status === 'no_show') {
      bg = 'bg-gray-200 text-gray-600';
    }

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${bg}`}>
        {badgeText}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
      <table className="w-full text-left text-sm text-text">
        <thead className="border-b border-border bg-surface-secondary text-xs font-semibold uppercase tracking-wider text-text-muted">
          <tr>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Time</th>
            <th className="px-6 py-4">Patient Name</th>
            <th className="px-6 py-4">Phone</th>
            <th className="px-6 py-4">Area</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {appointments.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center text-text-muted">
                  <div className="rounded-full bg-surface-secondary p-4 mb-4">
                    <Calendar className="h-8 w-8 text-text-muted/60" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-1">No Appointments Found</h3>
                  <p className="text-sm">We couldn't find any appointments matching your current filters.</p>
                </div>
              </td>
            </tr>
          ) : (
            appointments.map((appt) => {
              const dateStr = format(parse(appt.appointment_date, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy');
              const timeStr = format(parse(appt.start_time, 'HH:mm:ss', new Date()), 'hh:mm a');
              const initials = getInitials(appt.patient.full_name);

              return (
                <tr key={appt.id} className="transition-colors hover:bg-surface-secondary/50">
                  <td className="whitespace-nowrap px-6 py-4 font-medium">{dateStr}</td>
                  <td className="whitespace-nowrap px-6 py-4">{timeStr}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#E0F2F1] text-xs font-bold text-[#006064]">
                        {initials}
                      </div>
                      <span className="font-medium">{appt.patient.full_name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{appt.patient.phone}</td>
                  <td className="whitespace-nowrap px-6 py-4">{appt.area}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getStatusBadge(appt.status || 'booked', appt.payment_status || 'unpaid')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onView(appt)}
                        className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-secondary hover:text-text"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onReschedule(appt)}
                        className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-secondary hover:text-text"
                        title="Reschedule"
                      >
                        <Calendar className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onCancel(appt)}
                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Cancel"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
