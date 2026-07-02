import { createAdminClient } from '@/lib/supabase/server';
import PatientsModule, { PatientWithStats } from '@/components/dashboard/patients/PatientsModule';

export default async function PatientsPage() {
  const supabase = await createAdminClient();

  // Fetch all patients
  const { data: patients, error: patientsErr } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });

  if (patientsErr) {
    console.error('Failed to fetch patients:', patientsErr);
  }

  // Fetch appointments to aggregate stats
  const { data: appointments, error: apptErr } = await supabase
    .from('appointments')
    .select('patient_id, appointment_date');

  if (apptErr) {
    console.error('Failed to fetch appointments for stats:', apptErr);
  }

  // Aggregate stats per patient
  const statsMap: Record<string, { total_sessions: number; last_visit: string | null; is_active: boolean }> = {};
  
  if (patients) {
    patients.forEach(p => {
      statsMap[p.id] = { total_sessions: 0, last_visit: null, is_active: false };
    });
  }

  if (appointments) {
    appointments.forEach(appt => {
      const pId = appt.patient_id;
      if (statsMap[pId]) {
        statsMap[pId].total_sessions += 1;
        
        // Update last visit date if this appointment is more recent
        const currentLastVisit = statsMap[pId].last_visit;
        if (!currentLastVisit || new Date(appt.appointment_date) > new Date(currentLastVisit)) {
          statsMap[pId].last_visit = appt.appointment_date;
        }

        // Active logic: if they had a visit in the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        if (statsMap[pId].last_visit && new Date(statsMap[pId].last_visit!) > sixMonthsAgo) {
          statsMap[pId].is_active = true;
        }
      }
    });
  }

  const processedPatients: PatientWithStats[] = (patients || []).map(p => ({
    id: p.id,
    full_name: p.full_name,
    phone: p.phone,
    area: p.area,
    total_sessions: statsMap[p.id]?.total_sessions || 0,
    last_visit: statsMap[p.id]?.last_visit || null,
    is_active: statsMap[p.id]?.is_active || false,
  }));

  return (
    <PatientsModule initialPatients={processedPatients} />
  );
}
