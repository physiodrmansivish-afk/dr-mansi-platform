'use client';

import { X, Calendar, Clock, MapPin, Phone, User } from 'lucide-react';
import type { AppointmentWithPatient } from '@/types';
import { format, parse } from 'date-fns';

interface AppointmentDetailsDrawerProps {
  appointment: AppointmentWithPatient | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function AppointmentDetailsDrawer({ appointment, onClose, isOpen }: AppointmentDetailsDrawerProps) {
  if (!isOpen || !appointment) return null;

  const dateStr = format(parse(appointment.appointment_date, 'yyyy-MM-dd', new Date()), 'EEEE, MMMM dd, yyyy');
  const timeStr = format(parse(appointment.start_time, 'HH:mm:ss', new Date()), 'hh:mm a') + ' - ' + format(parse(appointment.end_time, 'HH:mm:ss', new Date()), 'hh:mm a');

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white shadow-xl h-full flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between border-b border-border p-4 sm:px-6">
          <h2 className="text-lg font-bold text-text">Appointment Details</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-text-muted hover:bg-surface-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Status Badge */}
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 uppercase tracking-wide">
              {appointment.status || 'BOOKED'}
            </span>
          </div>

          {/* Date and Time */}
          <div className="space-y-4 rounded-xl border border-border p-4 bg-surface">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-[#006064]" />
              <div>
                <p className="text-sm font-medium text-text-muted">Date</p>
                <p className="font-semibold text-text">{dateStr}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-[#006064]" />
              <div>
                <p className="text-sm font-medium text-text-muted">Time</p>
                <p className="font-semibold text-text">{timeStr}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-[#006064]" />
              <div>
                <p className="text-sm font-medium text-text-muted">Area / Service</p>
                <p className="font-semibold text-text">{appointment.area}</p>
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-text-muted">Patient Information</h3>
            <div className="space-y-4 rounded-xl border border-border p-4 bg-surface">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-muted">Name</p>
                  <p className="font-semibold text-text">{appointment.patient.full_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-muted">Phone</p>
                  <p className="font-semibold text-text">{appointment.patient.phone}</p>
                </div>
              </div>
              {appointment.patient.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-text-muted" />
                  <div>
                    <p className="text-sm font-medium text-text-muted">Address</p>
                    <p className="font-semibold text-text">{appointment.patient.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {appointment.patient.notes && (
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-text-muted">Patient Notes</h3>
              <div className="rounded-xl border border-border p-4 bg-yellow-50 text-yellow-800 text-sm">
                {appointment.patient.notes}
              </div>
            </div>
          )}

          {appointment.doctor_notes && (
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-text-muted">Doctor Notes</h3>
              <div className="rounded-xl border border-border p-4 bg-surface text-sm text-text">
                {appointment.doctor_notes}
              </div>
            </div>
          )}

        </div>
        
        <div className="border-t border-border p-4 bg-surface-secondary sm:px-6">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-border bg-white py-2.5 text-sm font-medium text-text shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
