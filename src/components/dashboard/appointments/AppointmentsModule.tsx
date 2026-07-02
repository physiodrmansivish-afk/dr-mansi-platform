'use client';

import { useState, useMemo } from 'react';
import type { AppointmentWithPatient } from '@/types';
import FilterBar from './FilterBar';
import AppointmentsList from './AppointmentsList';
import AppointmentsCalendar from './AppointmentsCalendar';
import RescheduleModal from './RescheduleModal';
import AppointmentDetailsDrawer from './AppointmentDetailsDrawer';
import { updateAppointmentStatus } from '@/app/dashboard/appointments/actions';

interface AppointmentsModuleProps {
  initialAppointments: AppointmentWithPatient[];
}

export default function AppointmentsModule({ initialAppointments }: AppointmentsModuleProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedAppt, setSelectedAppt] = useState<AppointmentWithPatient | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  // Filter logic
  const filteredAppointments = useMemo(() => {
    return initialAppointments.filter(appt => {
      const matchesSearch = appt.patient.full_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialAppointments, searchQuery, statusFilter]);

  // Actions
  const handleViewDetails = (appt: AppointmentWithPatient) => {
    setSelectedAppt(appt);
    setIsDetailsOpen(true);
  };

  const handleReschedule = (appt: AppointmentWithPatient) => {
    setSelectedAppt(appt);
    setIsRescheduleOpen(true);
  };

  const handleCancel = async (appt: AppointmentWithPatient) => {
    if (confirm(`Are you sure you want to cancel the appointment for ${appt.patient.full_name}?`)) {
      await updateAppointmentStatus(appt.id, 'cancelled');
    }
  };

  const handleMarkComplete = async (appt: AppointmentWithPatient) => {
    if (confirm(`Mark appointment for ${appt.patient.full_name} as completed?`)) {
      await updateAppointmentStatus(appt.id, 'completed');
    }
  };

  // KPIs
  const dailyTotal = filteredAppointments.length;
  const completed = filteredAppointments.filter(a => a.status === 'completed').length;
  const cancelled = filteredAppointments.filter(a => a.status === 'cancelled').length;
  const pending = filteredAppointments.filter(a => a.status === 'booked' || a.status === 'rescheduled').length;

  return (
    <div className="space-y-6">
      
      <FilterBar 
        view={view}
        onViewChange={setView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {view === 'list' ? (
        <AppointmentsList 
          appointments={filteredAppointments}
          onView={handleViewDetails}
          onReschedule={handleReschedule}
          onCancel={handleCancel}
        />
      ) : (
        <AppointmentsCalendar 
          appointments={filteredAppointments}
          onView={handleViewDetails}
        />
      )}

      {/* Footer KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#006064]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">Total</p>
            <p className="text-2xl font-bold text-[#006064]">{dailyTotal}</p>
          </div>
        </div>
        
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completed}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{cancelled}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">Pending</p>
            <p className="text-2xl font-bold text-gray-700">{pending}</p>
          </div>
        </div>
      </div>

      <RescheduleModal 
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        appointment={selectedAppt}
        onSuccess={() => {
          setSelectedAppt(null);
        }}
      />

      <AppointmentDetailsDrawer 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        appointment={selectedAppt}
      />
    </div>
  );
}
