'use client';

import { useState } from 'react';
import { User, Phone, MapPin, Calendar, Clock, FileText, ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Appointment } from '@/types';
import { format, parse } from 'date-fns';

interface PatientDetailsModuleProps {
  patient: {
    id: string;
    full_name: string;
    phone: string;
    address: string | null;
    area: string;
    notes: string | null;
  };
  appointments: Appointment[];
}

export default function PatientDetailsModule({ patient, appointments }: PatientDetailsModuleProps) {
  const router = useRouter();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(patient.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleSaveNotes = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditingNotes(false);
    }, 500);
  };

  const completedSessions = appointments.filter(a => a.status === 'completed').length;
  const lastVisit = appointments.length > 0 
    ? format(parse(appointments[0].appointment_date, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy') 
    : 'Never';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Back Button */}
      <div>
        <Link 
          href="/dashboard/patients"
          className="inline-flex items-center text-sm font-medium text-text-muted hover:text-[#006064]"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Patients
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="bg-[#006064] px-6 py-8 text-center text-white">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#006064] shadow-md">
                {getInitials(patient.full_name)}
              </div>
              <h2 className="mt-4 text-xl font-bold">{patient.full_name}</h2>
              <p className="mt-1 text-sm text-green-100 opacity-90">Patient Profile</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-text-muted" />
                <span className="text-sm font-medium text-text">{patient.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-text-muted shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text">{patient.area}</span>
                  {patient.address && <span className="text-sm text-text-muted mt-0.5">{patient.address}</span>}
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Clinical Notes</h3>
                  {!isEditingNotes && (
                    <button 
                      onClick={() => setIsEditingNotes(true)}
                      className="text-xs font-semibold text-[#006064] hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>
                
                {isEditingNotes ? (
                  <div className="space-y-3">
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-lg border border-border p-3 text-sm focus:border-[#006064] focus:outline-none focus:ring-1 focus:ring-[#006064] min-h-[120px]"
                      placeholder="Add clinical notes..."
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setNotes(patient.notes || '');
                          setIsEditingNotes(false);
                        }}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-text hover:bg-surface-secondary"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveNotes}
                        disabled={isSaving}
                        className="flex items-center rounded-lg bg-[#006064] px-3 py-1.5 text-xs font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                      >
                        <Save className="mr-1 h-3 w-3" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800 min-h-[80px]">
                    {patient.notes ? (
                      <p className="whitespace-pre-wrap">{patient.notes}</p>
                    ) : (
                      <p className="text-yellow-600/70 italic">No notes added yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-surface-secondary p-4 text-center">
                <p className="text-2xl font-bold text-[#006064]">{completedSessions}</p>
                <p className="text-xs font-medium text-text-muted mt-1">Completed</p>
              </div>
              <div className="rounded-lg bg-surface-secondary p-4 text-center">
                <p className="text-2xl font-bold text-[#006064]">{appointments.length}</p>
                <p className="text-xs font-medium text-text-muted mt-1">Total Booked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visit History & Invoices */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-border p-6 bg-surface-secondary/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#006064]" />
                <h2 className="text-lg font-bold text-text">Visit History</h2>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-text">
                <thead className="border-b border-border bg-surface-secondary text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <tr>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Area</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-text-muted">
                        No appointments found for this patient.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt) => {
                      const dateStr = format(parse(appt.appointment_date, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy');
                      const timeStr = format(parse(appt.start_time, 'HH:mm:ss', new Date()), 'hh:mm a');
                      return (
                        <tr key={appt.id} className="hover:bg-surface-secondary/30 transition-colors">
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="font-medium">{dateStr}</div>
                            <div className="text-text-muted text-xs mt-0.5">{timeStr}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">{appt.area}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              appt.status === 'completed' ? 'bg-green-100 text-green-800' :
                              appt.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                              appt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {appt.status?.toUpperCase() || 'UNKNOWN'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              appt.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {appt.payment_status?.toUpperCase() || 'UNPAID'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-border p-6 bg-surface-secondary/50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#006064]" />
                <h2 className="text-lg font-bold text-text">Invoices</h2>
              </div>
              <button 
                onClick={() => router.push('/dashboard/invoices/new')}
                className="rounded-lg bg-[#006064] px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
              >
                Create Invoice
              </button>
            </div>
            
            <div className="p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary mb-4">
                <FileText className="h-8 w-8 text-text-muted opacity-50" />
              </div>
              <h3 className="text-base font-bold text-text">No Invoices Yet</h3>
              <p className="mt-1 text-sm text-text-muted max-w-sm mx-auto">
                There are no invoices linked to this patient. You can create a new invoice for their sessions here.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
