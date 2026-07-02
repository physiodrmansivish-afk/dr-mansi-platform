'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updatePatientNotes(patientId: string, notes: string) {
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase
      .from('patients')
      .update({ notes })
      .eq('id', patientId);

    if (error) throw error;
    
    revalidatePath(`/dashboard/patients/${patientId}`);
    return { success: true };
  } catch (err: any) {
    console.error('Failed to update patient notes:', err);
    return { error: err.message || 'Failed to update notes' };
  }
}

export async function addPatientAction(formData: FormData) {
  try {
    const fullName = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const area = formData.get('area') as string;
    const address = formData.get('address') as string;

    if (!fullName || !phone || !area) {
      return { error: 'Missing required fields' };
    }

    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('patients')
      .insert({
        full_name: fullName,
        phone,
        area,
        address,
      })
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/dashboard/patients');
    return { success: true, patientId: data.id };
  } catch (err: any) {
    console.error('Failed to add patient:', err);
    return { error: err.message || 'Failed to add patient' };
  }
}
