import AppointmentsModule from '@/components/dashboard/appointments/AppointmentsModule';
import type { AppointmentWithPatient } from '@/types';

export default function AppointmentsPage() {
  const appts: AppointmentWithPatient[] = [];

  return (
    <div className="space-y-6">
      <AppointmentsModule initialAppointments={appts} />
    </div>
  );
}
