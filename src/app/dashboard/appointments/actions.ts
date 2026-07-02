'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { sendWhatsApp } from '@/lib/aisensy/sendMessage';
import { WHATSAPP_TEMPLATES } from '@/lib/aisensy/templates';
import { format, parse } from 'date-fns';
import { revalidatePath } from 'next/cache';

export async function updateAppointmentStatus(id: string, status: string) {
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    
    revalidatePath('/dashboard/appointments');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Failed to update status:', err);
    return { error: err.message || 'Failed to update status' };
  }
}

export async function rescheduleAppointment(
  id: string, 
  newDate: string, 
  newStartTime: string, 
  newEndTime: string,
  reason: string
) {
  try {
    const supabase = await createAdminClient();
    
    // Fetch the current appointment first to get old details
    const { data: appt, error: fetchErr } = await supabase
      .from('appointments')
      .select('*, patient:patients(*)')
      .eq('id', id)
      .single();

    if (fetchErr || !appt) throw fetchErr || new Error('Appointment not found');

    const oldDate = appt.appointment_date;
    const oldStartTime = appt.start_time;

    // 1. Update the appointment
    const { error: updateErr } = await supabase
      .from('appointments')
      .update({
        appointment_date: newDate,
        start_time: newStartTime,
        end_time: newEndTime,
        status: 'rescheduled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateErr) throw updateErr;

    // 2. Create history record
    const { error: histErr } = await supabase
      .from('appointment_history')
      .insert({
        appointment_id: id,
        action: 'rescheduled',
        old_date: oldDate,
        old_start_time: oldStartTime,
        new_date: newDate,
        new_start_time: newStartTime,
        reason: reason
      });

    if (histErr) console.error('Failed to write history record:', histErr);

    // 3. Send WhatsApp to patient
    if (appt.patient?.phone) {
      const formattedDate = format(parse(newDate, 'yyyy-MM-dd', new Date()), 'EEEE, dd MMMM yyyy');
      const formattedTime = format(parse(newStartTime, 'HH:mm:ss', new Date()), 'hh:mm a');
      
      await sendWhatsApp({
        phone: appt.patient.phone,
        templateName: WHATSAPP_TEMPLATES.RESCHEDULE_NOTIFICATION_PATIENT,
        params: [
          appt.patient.full_name,
          formattedDate,
          formattedTime,
          appt.area,
          appt.id.slice(0, 8)
        ],
        recipientType: 'patient',
        messageType: 'reschedule'
      });
    }

    revalidatePath('/dashboard/appointments');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Failed to reschedule:', err);
    return { error: err.message || 'Failed to reschedule appointment' };
  }
}
