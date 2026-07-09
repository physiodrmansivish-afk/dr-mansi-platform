import PatientDetailsModule from '@/components/dashboard/patients/PatientDetailsModule';

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Mock patient data for static UI
  const patient = {
    id,
    full_name: 'Mock Patient',
    phone: '1234567890',
    area: 'Mock Area',
    created_at: new Date().toISOString()
  };

  return (
    <PatientDetailsModule 
      patient={patient as any} 
      appointments={[]} 
    />
  );
}
