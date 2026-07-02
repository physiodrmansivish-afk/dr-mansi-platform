# Dr. Mansi Vishwakarma — Physiotherapy Platform
## Antigravity Agent Context File

***

## Project Identity

**Client:** Dr. Mansi Vishwakarma, BPT, MPT (Ortho), Consultant Physiotherapist  
**Product:** A bilingual physiotherapy clinic platform with a public patient-facing website and a private doctor dashboard.  
**Primary goal:** Streamline appointment booking, patient tracking, invoicing, and WhatsApp-based communication.

***

## Tech Stack (MANDATORY — do not deviate)

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| UI Primitives | Radix UI |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (doctor only — no patient login) |
| Forms | React Hook Form + Zod validation |
| i18n | next-intl (English + Marathi) |
| Date handling | date-fns |
| Charts | Recharts |
| HTTP | Axios |
| Payments | Paytm Payment Gateway (server-side checkout) |
| WhatsApp | AiSensy REST API (transactional templates only) |
| Deployment | Vercel + Supabase hosted DB |

***

## Folder Structure

```
src/
├── app/
│   ├── [locale]/              # Public website (en / mr)
│   │   ├── page.tsx           # Home
│   │   ├── about/page.tsx
│   │   ├── services/page.tsx
│   │   ├── areas/page.tsx
│   │   ├── book/page.tsx
│   │   └── contact/page.tsx
│   ├── dashboard/             # Doctor dashboard (no locale)
│   │   ├── page.tsx           # Overview
│   │   ├── appointments/
│   │   ├── availability/
│   │   ├── patients/
│   │   ├── invoices/
│   │   └── settings/
│   └── api/
│       ├── appointments/
│       ├── availability/
│       ├── invoices/
│       ├── payments/
│       └── webhooks/
│           └── paytm/
├── components/
│   ├── public/                # Website components
│   ├── dashboard/             # Dashboard components
│   └── shared/                # Used on both sides
├── lib/
│   ├── supabase/
│   ├── paytm/
│   ├── aisensy/
│   └── utils/
├── messages/
│   ├── en.json
│   └── mr.json
├── middleware.ts
└── types/
    └── index.ts
```

***

## Database Schema

### Table: patients
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
full_name text NOT NULL
phone text NOT NULL
alternate_phone text
address text
area text NOT NULL
language_preference text DEFAULT 'en'
notes text
created_at timestamptz DEFAULT now()
```

### Table: appointments
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
patient_id uuid REFERENCES patients(id)
appointment_date date NOT NULL
start_time time NOT NULL
end_time time NOT NULL
area text NOT NULL
status text DEFAULT 'booked'  -- booked | completed | rescheduled | cancelled | no_show
payment_status text DEFAULT 'unpaid'  -- unpaid | paid | partial | refunded
doctor_notes text
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```

### Table: appointment_history
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
appointment_id uuid REFERENCES appointments(id)
action text NOT NULL  -- created | rescheduled | cancelled | completed
old_date date
old_start_time time
new_date date
new_start_time time
reason text
changed_at timestamptz DEFAULT now()
```

### Table: blocked_slots
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
slot_date date NOT NULL
start_time time NOT NULL
end_time time NOT NULL
reason text
created_at timestamptz DEFAULT now()
```

### Table: invoices
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
invoice_number text UNIQUE NOT NULL  -- INV-YYYYMMDD-001
patient_id uuid REFERENCES patients(id)
appointment_id uuid REFERENCES appointments(id)
line_items jsonb NOT NULL  -- [{description, amount}]
subtotal numeric NOT NULL
discount numeric DEFAULT 0
total numeric NOT NULL
status text DEFAULT 'unpaid'  -- unpaid | paid | partial | refunded
issue_date date DEFAULT CURRENT_DATE
due_date date
notes text
created_at timestamptz DEFAULT now()
```

### Table: payments
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
invoice_id uuid REFERENCES invoices(id)
amount numeric NOT NULL
method text  -- paytm | cash | upi | bank_transfer
paytm_order_id text
paytm_txn_id text
status text  -- success | pending | failed | refunded
paid_at timestamptz
created_at timestamptz DEFAULT now()
```

### Table: whatsapp_logs
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
recipient_phone text NOT NULL
recipient_type text  -- patient | doctor
message_type text  -- booking_confirmation | reschedule | cancellation | reminder
template_name text
status text  -- sent | delivered | failed
sent_at timestamptz DEFAULT now()
```

***

## Business Rules

### Appointment Booking
- Patients do NOT create accounts. Booking is a guest form.
- Each booking is auto-confirmed (no doctor approval required).
- Default slot duration is 60 minutes.
- Available slots = all slots within working hours MINUS already booked slots MINUS doctor-blocked slots.
- If Paytm payment is configured as upfront, booking is only confirmed after successful payment.

### Working Hours (default — configurable in Settings)
- Monday to Saturday
- 9:00 AM to 6:00 PM
- Slots at 60-minute intervals: 9:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00

### Availability Blocking
- Doctor can block individual slots or entire days from the dashboard.
- Blocking a slot removes it from the public booking calendar immediately.

### Reschedule
- Only doctor can reschedule from the dashboard.
- On reschedule: old slot is freed, new slot is blocked, appointment_history is updated, WhatsApp is sent to patient.

### WhatsApp Notifications
- On new booking: message to patient + message to doctor (AiSensy templates).
- On reschedule: message to patient only.
- Provider: AiSensy REST API.
- Environment variable: AISENSY_API_KEY.

### Payments
- Provider: Paytm Payment Gateway.
- Environment variables: PAYTM_MERCHANT_ID, PAYTM_MERCHANT_KEY, PAYTM_WEBSITE, PAYTM_CHANNEL_ID, PAYTM_INDUSTRY_TYPE_ID.
- Webhook endpoint: /api/webhooks/paytm.

### Invoices
- Invoice number format: INV-YYYYMMDD-XXX (auto-generated).
- Created by doctor from dashboard.
- No GST in Phase 1 (plain receipts only).

***

## i18n Rules
- Public website supports English (en) and Marathi (mr).
- Language toggle persists via cookie.
- All public-facing strings must use next-intl useTranslations().
- Dashboard is English only.
- Locale routing: /en/... and /mr/...
- Default locale: en.

***

## Design System
- **Primary color:** Use the exact values from the imported design files in /designs.
- **Font:** As per design files.
- **Do NOT override the design.** Implement pixel-accurate components matching the design exports.
- All designs are in /designs folder as exported images from Stitch.
- Each design image is named to match the page/component it represents.

***

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AISENSY_API_KEY=
PAYTM_MERCHANT_ID=
PAYTM_MERCHANT_KEY=
PAYTM_WEBSITE=
PAYTM_CHANNEL_ID=
PAYTM_INDUSTRY_TYPE_ID=
PAYTM_CALLBACK_URL=
NEXT_PUBLIC_BASE_URL=
```

***

## Code Quality Rules
- Always use TypeScript. No `any` types.
- All API routes must use Zod for request validation.
- All database queries go through lib/supabase/queries.ts — no raw Supabase calls in components.
- Use server components where possible. Client components only when interactivity is required.
- All forms use React Hook Form + Zod resolver.
- No inline styles. All styling via Tailwind utility classes.
- Shared UI components go in /components/shared.

***

## Agent Behaviour Instructions
- Always read this file before starting any task.
- Always read the relevant PROMPT file for the page you are building.
- Always open the corresponding design image from /designs before writing any component.
- Match the design pixel-accurately — do not invent layouts.
- Ask for clarification if a design image is ambiguous.
- Do not install additional packages without confirming first.
- Commit with descriptive messages after each completed page.