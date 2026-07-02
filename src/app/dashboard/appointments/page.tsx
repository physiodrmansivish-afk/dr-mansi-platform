import { createAdminClient } from '@/lib/supabase/server';
import AppointmentsModule from '@/components/dashboard/appointments/AppointmentsModule';
import type { AppointmentWithPatient } from '@/types';

export default async function AppointmentsPage() {
  const supabase = await createAdminClient();
  
  // We fetch all appointments for the module.
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*, patient:patients(*)')
    .order('appointment_date', { ascending: false })
    .order('start_time', { ascending: false });

  if (error) {
    console.error('Failed to fetch appointments:', error);
  }

  const appts = (appointments || []) as AppointmentWithPatient[];

  return (
    <div className="space-y-6">
      <AppointmentsModule initialAppointments={appts} />
    </div>
  );
}
