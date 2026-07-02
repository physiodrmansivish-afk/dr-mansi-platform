// ============================================================================
// Dr. Mansi Platform — Supabase Query Functions
// All database access goes through this module.
// No raw Supabase calls in components (per AGENTS.md Code Quality Rules).
// ============================================================================

import { SupabaseClient } from '@supabase/supabase-js';
import type {
  Patient,
  PatientInsert,
  PatientUpdate,
  Appointment,
  AppointmentInsert,
  AppointmentUpdate,
  AppointmentWithPatient,
  AppointmentHistory,
  AppointmentHistoryInsert,
  BlockedSlot,
  BlockedSlotInsert,
  Invoice,
  InvoiceInsert,
  InvoiceUpdate,
  InvoiceWithPatient,
  Payment,
  PaymentInsert,
  PaymentUpdate,
  WhatsAppLog,
  WhatsAppLogInsert,
} from '@/types';

// ---------------------------------------------------------------------------
// Patients
// ---------------------------------------------------------------------------

export async function getPatients(client: SupabaseClient) {
  const { data, error } = await client
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Patient[];
}

export async function getPatientById(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Patient;
}

export async function getPatientByPhone(
  client: SupabaseClient,
  phone: string,
) {
  const { data, error } = await client
    .from('patients')
    .select('*')
    .eq('phone', phone)
    .maybeSingle();

  if (error) throw error;
  return data as Patient | null;
}

export async function createPatient(
  client: SupabaseClient,
  patient: PatientInsert,
) {
  const { data, error } = await client
    .from('patients')
    .insert(patient)
    .select()
    .single();

  if (error) throw error;
  return data as Patient;
}

export async function updatePatient(
  client: SupabaseClient,
  id: string,
  updates: PatientUpdate,
) {
  const { data, error } = await client
    .from('patients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Patient;
}

export async function deletePatient(client: SupabaseClient, id: string) {
  const { error } = await client.from('patients').delete().eq('id', id);

  if (error) throw error;
}

export async function searchPatients(
  client: SupabaseClient,
  query: string,
) {
  const { data, error } = await client
    .from('patients')
    .select('*')
    .or(`full_name.ilike.%${query}%,phone.ilike.%${query}%`)
    .order('full_name', { ascending: true });

  if (error) throw error;
  return data as Patient[];
}

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------

export async function getAppointments(client: SupabaseClient) {
  const { data, error } = await client
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data as Appointment[];
}

export async function getAppointmentById(
  client: SupabaseClient,
  id: string,
) {
  const { data, error } = await client
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Appointment;
}

export async function getAppointmentWithPatient(
  client: SupabaseClient,
  id: string,
) {
  const { data, error } = await client
    .from('appointments')
    .select('*, patient:patients(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as AppointmentWithPatient;
}

export async function getAppointmentsByDate(
  client: SupabaseClient,
  date: string,
) {
  const { data, error } = await client
    .from('appointments')
    .select('*, patient:patients(*)')
    .eq('appointment_date', date)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data as AppointmentWithPatient[];
}

export async function getAppointmentsByPatient(
  client: SupabaseClient,
  patientId: string,
) {
  const { data, error } = await client
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId)
    .order('appointment_date', { ascending: false });

  if (error) throw error;
  return data as Appointment[];
}

export async function getAppointmentsByDateRange(
  client: SupabaseClient,
  startDate: string,
  endDate: string,
) {
  const { data, error } = await client
    .from('appointments')
    .select('*, patient:patients(*)')
    .gte('appointment_date', startDate)
    .lte('appointment_date', endDate)
    .order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data as AppointmentWithPatient[];
}

export async function createAppointment(
  client: SupabaseClient,
  appointment: AppointmentInsert,
) {
  const { data, error } = await client
    .from('appointments')
    .insert(appointment)
    .select()
    .single();

  if (error) throw error;
  return data as Appointment;
}

export async function updateAppointment(
  client: SupabaseClient,
  id: string,
  updates: AppointmentUpdate,
) {
  const { data, error } = await client
    .from('appointments')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Appointment;
}

export async function deleteAppointment(
  client: SupabaseClient,
  id: string,
) {
  const { error } = await client.from('appointments').delete().eq('id', id);

  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Appointment History
// ---------------------------------------------------------------------------

export async function getAppointmentHistory(
  client: SupabaseClient,
  appointmentId: string,
) {
  const { data, error } = await client
    .from('appointment_history')
    .select('*')
    .eq('appointment_id', appointmentId)
    .order('changed_at', { ascending: false });

  if (error) throw error;
  return data as AppointmentHistory[];
}

export async function createAppointmentHistory(
  client: SupabaseClient,
  entry: AppointmentHistoryInsert,
) {
  const { data, error } = await client
    .from('appointment_history')
    .insert(entry)
    .select()
    .single();

  if (error) throw error;
  return data as AppointmentHistory;
}

// ---------------------------------------------------------------------------
// Blocked Slots
// ---------------------------------------------------------------------------

export async function getBlockedSlots(client: SupabaseClient) {
  const { data, error } = await client
    .from('blocked_slots')
    .select('*')
    .order('slot_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data as BlockedSlot[];
}

export async function getBlockedSlotsByDate(
  client: SupabaseClient,
  date: string,
) {
  const { data, error } = await client
    .from('blocked_slots')
    .select('*')
    .eq('slot_date', date)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data as BlockedSlot[];
}

export async function getBlockedSlotsByDateRange(
  client: SupabaseClient,
  startDate: string,
  endDate: string,
) {
  const { data, error } = await client
    .from('blocked_slots')
    .select('*')
    .gte('slot_date', startDate)
    .lte('slot_date', endDate)
    .order('slot_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data as BlockedSlot[];
}

export async function createBlockedSlot(
  client: SupabaseClient,
  slot: BlockedSlotInsert,
) {
  const { data, error } = await client
    .from('blocked_slots')
    .insert(slot)
    .select()
    .single();

  if (error) throw error;
  return data as BlockedSlot;
}

export async function deleteBlockedSlot(
  client: SupabaseClient,
  id: string,
) {
  const { error } = await client.from('blocked_slots').delete().eq('id', id);

  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Invoices
// ---------------------------------------------------------------------------

export async function getInvoices(client: SupabaseClient) {
  const { data, error } = await client
    .from('invoices')
    .select('*, patient:patients(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as InvoiceWithPatient[];
}

export async function getInvoiceById(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from('invoices')
    .select('*, patient:patients(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as InvoiceWithPatient;
}

export async function getInvoicesByPatient(
  client: SupabaseClient,
  patientId: string,
) {
  const { data, error } = await client
    .from('invoices')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Invoice[];
}

export async function createInvoice(
  client: SupabaseClient,
  invoice: InvoiceInsert,
) {
  const { data, error } = await client
    .from('invoices')
    .insert(invoice)
    .select()
    .single();

  if (error) throw error;
  return data as Invoice;
}

export async function updateInvoice(
  client: SupabaseClient,
  id: string,
  updates: InvoiceUpdate,
) {
  const { data, error } = await client
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Invoice;
}

export async function deleteInvoice(client: SupabaseClient, id: string) {
  const { error } = await client.from('invoices').delete().eq('id', id);

  if (error) throw error;
}

/**
 * Generates the next invoice number in the format INV-YYYYMMDD-XXX.
 * Counts existing invoices for today and increments.
 */
export async function generateInvoiceNumber(
  client: SupabaseClient,
  date: string,
) {
  const prefix = `INV-${date.replace(/-/g, '')}`;

  const { count, error } = await client
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .like('invoice_number', `${prefix}%`);

  if (error) throw error;

  const nextNumber = ((count ?? 0) + 1).toString().padStart(3, '0');
  return `${prefix}-${nextNumber}`;
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

export async function getPayments(client: SupabaseClient) {
  const { data, error } = await client
    .from('payments')
    .select('*, invoice:invoices(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as (Payment & { invoice: Invoice })[];
}

export async function getPaymentsByInvoice(
  client: SupabaseClient,
  invoiceId: string,
) {
  const { data, error } = await client
    .from('payments')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Payment[];
}

export async function getPaymentByPaytmOrderId(
  client: SupabaseClient,
  orderId: string,
) {
  const { data, error } = await client
    .from('payments')
    .select('*')
    .eq('paytm_order_id', orderId)
    .maybeSingle();

  if (error) throw error;
  return data as Payment | null;
}

export async function createPayment(
  client: SupabaseClient,
  payment: PaymentInsert,
) {
  const { data, error } = await client
    .from('payments')
    .insert(payment)
    .select()
    .single();

  if (error) throw error;
  return data as Payment;
}

export async function updatePayment(
  client: SupabaseClient,
  id: string,
  updates: PaymentUpdate,
) {
  const { data, error } = await client
    .from('payments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Payment;
}

// ---------------------------------------------------------------------------
// WhatsApp Logs
// ---------------------------------------------------------------------------

export async function getWhatsAppLogs(client: SupabaseClient) {
  const { data, error } = await client
    .from('whatsapp_logs')
    .select('*')
    .order('sent_at', { ascending: false });

  if (error) throw error;
  return data as WhatsAppLog[];
}

export async function getWhatsAppLogsByPhone(
  client: SupabaseClient,
  phone: string,
) {
  const { data, error } = await client
    .from('whatsapp_logs')
    .select('*')
    .eq('recipient_phone', phone)
    .order('sent_at', { ascending: false });

  if (error) throw error;
  return data as WhatsAppLog[];
}

export async function createWhatsAppLog(
  client: SupabaseClient,
  log: WhatsAppLogInsert,
) {
  const { data, error } = await client
    .from('whatsapp_logs')
    .insert(log)
    .select()
    .single();

  if (error) throw error;
  return data as WhatsAppLog;
}

// ---------------------------------------------------------------------------
// Dashboard Analytics
// ---------------------------------------------------------------------------

export async function getDashboardMetrics(client: SupabaseClient) {
  const today = new Date().toISOString().split('T')[0];
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const { count: todayAppointments } = await client
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('appointment_date', today)
    .neq('status', 'cancelled');

  const { count: pendingPayments } = await client
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('payment_status', 'unpaid')
    .neq('status', 'cancelled');

  const { count: totalPatients } = await client
    .from('patients')
    .select('*', { count: 'exact', head: true });

  const { data: payments } = await client
    .from('payments')
    .select('amount')
    .eq('status', 'success')
    .gte('paid_at', startOfMonth);

  const thisMonthRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  return {
    todayAppointments: todayAppointments || 0,
    pendingPayments: pendingPayments || 0,
    totalPatients: totalPatients || 0,
    thisMonthRevenue
  };
}

export async function getUpcomingAppointments(client: SupabaseClient, limit = 5) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await client
    .from('appointments')
    .select('*, patient:patients(*)')
    .gte('appointment_date', today)
    .neq('status', 'cancelled')
    .order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data as AppointmentWithPatient[];
}

export async function getRecentActivity(client: SupabaseClient, limit = 5) {
  // Fetch top N from various tables and merge them in JS
  const [appointmentsRes, paymentsRes, patientsRes] = await Promise.all([
    client.from('appointments').select('id, created_at, patient:patients(full_name)').order('created_at', { ascending: false }).limit(limit),
    client.from('payments').select('id, created_at, amount, invoice:invoices(invoice_number)').order('created_at', { ascending: false }).limit(limit),
    client.from('patients').select('id, created_at, full_name').order('created_at', { ascending: false }).limit(limit)
  ]);

  const activities: Array<{ id: string, type: string, message: string, timestamp: string }> = [];

  if (appointmentsRes.data) {
    appointmentsRes.data.forEach((a: any) => {
      activities.push({
        id: `appt-${a.id}`,
        type: 'booking',
        message: `New booking received for ${a.patient?.full_name}`,
        timestamp: a.created_at
      });
    });
  }

  if (paymentsRes.data) {
    paymentsRes.data.forEach((p: any) => {
      activities.push({
        id: `pay-${p.id}`,
        type: 'payment',
        message: `Payment of ₹${p.amount} received for ${p.invoice?.invoice_number || 'booking'}`,
        timestamp: p.created_at
      });
    });
  }

  if (patientsRes.data) {
    patientsRes.data.forEach((p: any) => {
      activities.push({
        id: `pat-${p.id}`,
        type: 'patient',
        message: `New patient registered: ${p.full_name}`,
        timestamp: p.created_at
      });
    });
  }

  // Sort descending by timestamp
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return activities.slice(0, limit);
}
