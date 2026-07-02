'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';

export async function createInvoice(data: any) {
  try {
    const supabase = await createAdminClient();
    
    // Generate Invoice Number (INV-YYYYMMDD-XXX)
    const today = format(new Date(), 'yyyyMMdd');
    const { count, error: countErr } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .like('invoice_number', `INV-${today}-%`);
      
    if (countErr) throw countErr;
    
    const seq = (count || 0) + 1;
    const invoiceNumber = `INV-${today}-${seq.toString().padStart(3, '0')}`;
    
    // Insert Invoice
    const { data: newInvoice, error } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        patient_id: data.patientId,
        appointment_id: data.appointmentId || null,
        line_items: data.lineItems,
        subtotal: data.subtotal,
        discount: data.discount,
        total: data.total,
        status: data.status || 'unpaid',
        issue_date: data.issueDate,
        due_date: data.dueDate || null,
        notes: data.notes || null
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard/invoices');
    revalidatePath(`/dashboard/patients/${data.patientId}`);
    return { success: true, invoiceId: newInvoice.id };
  } catch (err: any) {
    console.error('Failed to create invoice:', err);
    return { error: err.message || 'Failed to create invoice' };
  }
}

export async function markInvoicePaid(invoiceId: string, amount: number, method: string, reference: string, appointmentId?: string) {
  try {
    const supabase = await createAdminClient();
    
    // 1. Insert payment record
    const { error: paymentErr } = await supabase
      .from('payments')
      .insert({
        invoice_id: invoiceId,
        amount,
        method,
        status: 'success', // For manual entry, assume success
        paytm_order_id: reference || null,
        paid_at: new Date().toISOString()
      });
      
    if (paymentErr) throw paymentErr;

    // 2. Update invoice status
    const { error: invErr } = await supabase
      .from('invoices')
      .update({ status: 'paid' })
      .eq('id', invoiceId);
      
    if (invErr) throw invErr;

    // 3. Update linked appointment if provided
    if (appointmentId) {
      await supabase
        .from('appointments')
        .update({ payment_status: 'paid' })
        .eq('id', appointmentId);
    }

    revalidatePath('/dashboard/invoices');
    return { success: true };
  } catch (err: any) {
    console.error('Failed to mark invoice as paid:', err);
    return { error: err.message || 'Failed to record payment' };
  }
}
