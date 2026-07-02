// ============================================================================
// Dr. Mansi Platform — Type Definitions
// Mirrors the database schema defined in AGENTS.md exactly.
// ============================================================================

// ---------------------------------------------------------------------------
// Enum-like union types
// ---------------------------------------------------------------------------

export type AppointmentStatus =
  | 'booked'
  | 'completed'
  | 'rescheduled'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 'unpaid' | 'paid' | 'partial' | 'refunded';

export type AppointmentHistoryAction =
  | 'created'
  | 'rescheduled'
  | 'cancelled'
  | 'completed';

export type PaymentMethod = 'paytm' | 'cash' | 'upi' | 'bank_transfer';

export type PaymentTransactionStatus =
  | 'success'
  | 'pending'
  | 'failed'
  | 'refunded';

export type WhatsAppRecipientType = 'patient' | 'doctor';

export type WhatsAppMessageType =
  | 'booking_confirmation'
  | 'reschedule'
  | 'cancellation'
  | 'reminder';

export type WhatsAppDeliveryStatus = 'sent' | 'delivered' | 'failed';

export type Locale = 'en' | 'mr';

// ---------------------------------------------------------------------------
// Table: patients
// ---------------------------------------------------------------------------

export interface Patient {
  id: string;
  full_name: string;
  phone: string;
  alternate_phone: string | null;
  address: string | null;
  area: string;
  language_preference: Locale;
  notes: string | null;
  created_at: string;
}

export type PatientInsert = Omit<Patient, 'id' | 'created_at'>;
export type PatientUpdate = Partial<PatientInsert>;

// ---------------------------------------------------------------------------
// Table: appointments
// ---------------------------------------------------------------------------

export interface Appointment {
  id: string;
  patient_id: string;
  appointment_date: string; // ISO date string (YYYY-MM-DD)
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  area: string;
  status: AppointmentStatus;
  payment_status: PaymentStatus;
  doctor_notes: string | null;
  created_at: string;
  updated_at: string;
}

export type AppointmentInsert = Omit<
  Appointment,
  'id' | 'created_at' | 'updated_at' | 'status' | 'payment_status'
> & {
  status?: AppointmentStatus;
  payment_status?: PaymentStatus;
};

export type AppointmentUpdate = Partial<
  Omit<Appointment, 'id' | 'created_at'>
>;

// ---------------------------------------------------------------------------
// Table: appointment_history
// ---------------------------------------------------------------------------

export interface AppointmentHistory {
  id: string;
  appointment_id: string;
  action: AppointmentHistoryAction;
  old_date: string | null;
  old_start_time: string | null;
  new_date: string | null;
  new_start_time: string | null;
  reason: string | null;
  changed_at: string;
}

export type AppointmentHistoryInsert = Omit<
  AppointmentHistory,
  'id' | 'changed_at'
>;

// ---------------------------------------------------------------------------
// Table: blocked_slots
// ---------------------------------------------------------------------------

export interface BlockedSlot {
  id: string;
  slot_date: string; // ISO date string (YYYY-MM-DD)
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  reason: string | null;
  created_at: string;
}

export type BlockedSlotInsert = Omit<BlockedSlot, 'id' | 'created_at'>;

// ---------------------------------------------------------------------------
// Table: invoices
// ---------------------------------------------------------------------------

export interface InvoiceLineItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  patient_id: string;
  appointment_id: string;
  line_items: InvoiceLineItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: PaymentStatus;
  issue_date: string;
  due_date: string | null;
  notes: string | null;
  created_at: string;
}

export type InvoiceInsert = Omit<
  Invoice,
  'id' | 'created_at' | 'status' | 'discount'
> & {
  status?: PaymentStatus;
  discount?: number;
};

export type InvoiceUpdate = Partial<Omit<Invoice, 'id' | 'created_at'>>;

// ---------------------------------------------------------------------------
// Table: payments
// ---------------------------------------------------------------------------

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  method: PaymentMethod | null;
  paytm_order_id: string | null;
  paytm_txn_id: string | null;
  status: PaymentTransactionStatus | null;
  paid_at: string | null;
  created_at: string;
}

export type PaymentInsert = Omit<Payment, 'id' | 'created_at'>;
export type PaymentUpdate = Partial<Omit<Payment, 'id' | 'created_at'>>;

// ---------------------------------------------------------------------------
// Table: whatsapp_logs
// ---------------------------------------------------------------------------

export interface WhatsAppLog {
  id: string;
  recipient_phone: string;
  recipient_type: WhatsAppRecipientType | null;
  message_type: WhatsAppMessageType | null;
  template_name: string | null;
  status: WhatsAppDeliveryStatus | null;
  sent_at: string;
}

export type WhatsAppLogInsert = Omit<WhatsAppLog, 'id' | 'sent_at'> & {
  sent_at?: string;
};

// ---------------------------------------------------------------------------
// Joined / view types (useful for UI)
// ---------------------------------------------------------------------------

export interface AppointmentWithPatient extends Appointment {
  patient: Patient;
}

export interface InvoiceWithPatient extends Invoice {
  patient: Patient;
}

export interface PaymentWithInvoice extends Payment {
  invoice: Invoice;
}
