-- ============================================================
-- Dr. Mansi Vishwakarma — Physiotherapy Platform
-- Supabase Database Migrations
-- ============================================================
-- 
-- HOW TO USE:
-- 1. Open your Supabase Dashboard → SQL Editor → New Query.
-- 2. Copy the ENTIRE contents of this file and paste it in.
-- 3. Click "Run" to execute all migrations.
-- 4. If you have already run previous migrations, only copy
--    the NEW section(s) added at the bottom.
--
-- Each section is titled and dated so you can track changes.
-- ============================================================


-- ============================================================
-- MIGRATION 001: Core Tables (Initial Schema)
-- Date: 2026-07-02
-- Description: Create all foundational tables for the platform.
-- ============================================================

-- 1. Patients
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  alternate_phone text,
  address text,
  area text NOT NULL,
  language_preference text DEFAULT 'en',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 2. Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id),
  appointment_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  area text NOT NULL,
  status text DEFAULT 'booked',          -- booked | completed | rescheduled | cancelled | no_show
  payment_status text DEFAULT 'unpaid',  -- unpaid | paid | partial | refunded
  doctor_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Appointment History (audit trail for reschedules/cancellations)
CREATE TABLE IF NOT EXISTS appointment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id),
  action text NOT NULL,       -- created | rescheduled | cancelled | completed
  old_date date,
  old_start_time time,
  new_date date,
  new_start_time time,
  reason text,
  changed_at timestamptz DEFAULT now()
);

-- 4. Blocked Slots (doctor availability overrides)
CREATE TABLE IF NOT EXISTS blocked_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- 5. Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,   -- Format: INV-YYYYMMDD-XXX
  patient_id uuid REFERENCES patients(id),
  appointment_id uuid REFERENCES appointments(id),
  line_items jsonb NOT NULL,             -- [{description, amount}]
  subtotal numeric NOT NULL,
  discount numeric DEFAULT 0,
  total numeric NOT NULL,
  status text DEFAULT 'unpaid',          -- unpaid | paid | partial | refunded
  issue_date date DEFAULT CURRENT_DATE,
  due_date date,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 6. Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id),
  amount numeric NOT NULL,
  method text,                -- paytm | cash | upi | bank_transfer
  paytm_order_id text,
  paytm_txn_id text,
  status text,                -- success | pending | failed | refunded
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 7. WhatsApp Logs
CREATE TABLE IF NOT EXISTS whatsapp_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_phone text NOT NULL,
  recipient_type text,        -- patient | doctor
  message_type text,          -- booking_confirmation | reschedule | cancellation | reminder
  template_name text,
  status text,                -- sent | delivered | failed
  sent_at timestamptz DEFAULT now()
);


-- ============================================================
-- MIGRATION 002: Indexes for Performance
-- Date: 2026-07-02
-- Description: Add indexes on frequently queried columns.
-- ============================================================

-- Fast lookup of patients by phone (used during booking upsert)
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);

-- Fast lookup of appointments by date (used for available-slots API)
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- Fast lookup of appointments by patient (used in patient detail page)
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);

-- Fast lookup of blocked slots by date (used for available-slots API)
CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON blocked_slots(slot_date);

-- Fast lookup of invoices by patient (used in patient detail page)
CREATE INDEX IF NOT EXISTS idx_invoices_patient ON invoices(patient_id);

-- Fast lookup of invoices by status (used for dashboard filters)
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Fast lookup of payments by invoice (used when marking invoices paid)
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);


-- ============================================================
-- MIGRATION 003: Row Level Security (RLS) Policies
-- Date: 2026-07-02
-- Description: Enable RLS on all tables. Allow full access for
--              authenticated users (the doctor) and read-only
--              access via anon key for the public booking flow.
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_logs ENABLE ROW LEVEL SECURITY;

-- Doctor (authenticated) has full access to all tables
CREATE POLICY "Doctor full access on patients"
  ON patients FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Doctor full access on appointments"
  ON appointments FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Doctor full access on appointment_history"
  ON appointment_history FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Doctor full access on blocked_slots"
  ON blocked_slots FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Doctor full access on invoices"
  ON invoices FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Doctor full access on payments"
  ON payments FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Doctor full access on whatsapp_logs"
  ON whatsapp_logs FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Public (anon) can read blocked_slots and appointments
-- (needed for the available-slots API on the booking page)
CREATE POLICY "Public can read blocked_slots"
  ON blocked_slots FOR SELECT
  USING (true);

CREATE POLICY "Public can read appointments for slot availability"
  ON appointments FOR SELECT
  USING (true);

-- Public (anon) can insert patients and appointments
-- (needed for the booking flow — guest users create bookings)
CREATE POLICY "Public can insert patients"
  ON patients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can insert appointments"
  ON appointments FOR INSERT
  WITH CHECK (true);

-- Public (anon) can read patients by phone
-- (needed for patient upsert during booking)
CREATE POLICY "Public can read patients by phone"
  ON patients FOR SELECT
  USING (true);

-- Public (anon) can update patients
-- (needed for upsert during booking — update existing patient info)
CREATE POLICY "Public can update patients"
  ON patients FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Public (anon) can insert appointment_history
-- (needed when booking creates initial history record)
CREATE POLICY "Public can insert appointment_history"
  ON appointment_history FOR INSERT
  WITH CHECK (true);

-- Public (anon) can insert whatsapp_logs
-- (needed for logging WhatsApp messages sent during booking)
CREATE POLICY "Public can insert whatsapp_logs"
  ON whatsapp_logs FOR INSERT
  WITH CHECK (true);


-- ============================================================
-- END OF MIGRATIONS
-- ============================================================
-- When adding new migrations, append them below with:
--   -- MIGRATION NNN: Title
--   -- Date: YYYY-MM-DD
--   -- Description: What this migration does.
-- ============================================================
