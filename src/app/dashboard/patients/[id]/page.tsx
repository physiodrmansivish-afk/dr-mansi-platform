import { createAdminClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PatientDetailsModule from '@/components/dashboard/patients/PatientDetailsModule';

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createAdminClient();
  const { id } = await params;

  // Fetch patient profile
  const { data: patient, error: patientErr } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();

  if (patientErr || !patient) {
    console.error('Failed to fetch patient details:', patientErr);
    notFound();
  }

  // Fetch all appointments for this patient
  const { data: appointments, error: apptErr } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', id)
    .order('appointment_date', { ascending: false })
    .order('start_time', { ascending: false });

  if (apptErr) {
    console.error('Failed to fetch patient appointments:', apptErr);
  }

  return (
    <PatientDetailsModule 
      patient={patient} 
      appointments={appointments || []} 
    />
  );
}
