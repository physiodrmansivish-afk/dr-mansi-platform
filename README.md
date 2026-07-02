# Dr. Mansi Vishwakarma — Physiotherapy Platform

A bilingual (English + Marathi) physiotherapy clinic platform with a **public patient-facing website** and a **private doctor dashboard** for Dr. Mansi Vishwakarma (BPT, MPT Ortho), Consultant Physiotherapist based in Nagpur.

---

## ✨ Features

### Public Website (`/en/...` · `/mr/...`)
- **Home** — Hero section, services preview, testimonials, and call-to-action
- **About** — Doctor profile, qualifications, experience stats
- **Services** — 6 service categories with descriptions and pricing
- **Areas We Serve** — 12 Nagpur localities with home-visit coverage
- **Book Appointment** — 4-step booking flow (Service → Date/Slot → Details → Payment)
- **Contact** — Contact form and clinic information
- **Language Toggle** — Switch between English and Marathi on any page

### Doctor Dashboard (`/dashboard/...`)
- **Login** — Secure email/password authentication via Supabase Auth
- **Overview** — KPI cards, today's appointments, revenue chart, upcoming schedule
- **Appointments** — Calendar & list view, filters, reschedule/cancel/complete actions
- **Availability** — Weekly calendar, block/unblock slots, manage working hours
- **Patients** — Patient records with search, area filter, add new patient modal, patient detail page with visit history
- **Invoices** — Create/manage invoices, line items, mark as paid, payment recording
- **Settings** — Working hours, service areas, clinic info, WhatsApp template config

---

## 🛠 Tech Stack

| Layer             | Technology                              |
|-------------------|-----------------------------------------|
| Framework         | Next.js 15 (App Router, TypeScript)     |
| Styling           | Tailwind CSS v4                         |
| UI Primitives     | Radix UI                                |
| Icons             | Lucide React                            |
| Database          | Supabase (PostgreSQL)                   |
| Auth              | Supabase Auth (doctor only)             |
| Forms             | React Hook Form + Zod validation        |
| i18n              | next-intl (English + Marathi)           |
| Date Handling     | date-fns                                |
| Charts            | Recharts                                |
| HTTP Client       | Axios                                   |
| Payments          | Paytm Payment Gateway                   |
| WhatsApp          | AiSensy REST API                        |
| Notifications     | react-hot-toast                         |
| Deployment        | Vercel + Supabase hosted DB             |

---

## 📁 Project Structure

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
│   ├── dashboard/             # Doctor dashboard (English only)
│   │   ├── page.tsx           # Overview
│   │   ├── appointments/
│   │   ├── availability/
│   │   ├── patients/
│   │   ├── invoices/
│   │   ├── settings/
│   │   └── login/
│   └── api/
│       ├── appointments/
│       ├── availability/
│       ├── invoices/
│       ├── payments/
│       └── webhooks/paytm/
├── components/
│   ├── public/                # Website components
│   ├── dashboard/             # Dashboard components
│   └── shared/                # Navbar, Footer
├── lib/
│   ├── supabase/              # Client, server, middleware, queries
│   ├── paytm/                 # Checksum generation
│   ├── aisensy/               # WhatsApp messaging
│   └── utils/
├── messages/
│   ├── en.json                # English translations
│   └── mr.json                # Marathi translations
├── middleware.ts
├── types/index.ts
└── i18n/
    ├── request.ts
    └── routing.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/physiodrmansivish-afk/dr-mansi-platform.git
cd dr-mansi-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

AISENSY_API_KEY=
PAYTM_MERCHANT_ID=
PAYTM_MERCHANT_KEY=
PAYTM_WEBSITE=
PAYTM_CHANNEL_ID=
PAYTM_INDUSTRY_TYPE_ID=
PAYTM_CALLBACK_URL=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> **Where to find Supabase keys:** Supabase Dashboard → Project Settings → API

### 4. Set Up the Database

1. Open your Supabase Dashboard → **SQL Editor** → **New Query**.
2. Copy the entire contents of [`supabase/migrations.sql`](supabase/migrations.sql) and paste it in.
3. Click **Run**.

This creates all 7 tables, performance indexes, and Row Level Security policies.

### 5. Create the Doctor Account

1. In Supabase Dashboard → **Authentication** → **Users**.
2. Click **Add user** → **Create new user**.
3. Enter an email and password. Check **"Auto Confirm User"**.
4. Click **Create user**.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public website and [http://localhost:3000/dashboard/login](http://localhost:3000/dashboard/login) for the doctor dashboard.

---

## 🗄 Database Schema

| Table                  | Purpose                                    |
|------------------------|--------------------------------------------|
| `patients`             | Patient records (name, phone, area, notes) |
| `appointments`         | Booked appointments with status tracking   |
| `appointment_history`  | Audit trail for reschedules/cancellations   |
| `blocked_slots`        | Doctor availability overrides              |
| `invoices`             | Invoice records with line items (JSONB)    |
| `payments`             | Payment records (Paytm, cash, UPI, bank)   |
| `whatsapp_logs`        | WhatsApp notification delivery logs        |

Full schema with columns and constraints is in [`supabase/migrations.sql`](supabase/migrations.sql).

---

## 🌐 Deployment (Vercel)

### 1. Push to GitHub
```bash
git add -A
git commit -m "your commit message"
git push origin main
```

### 2. Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.
2. Add the following **Environment Variables** in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy.

Vercel will automatically redeploy on every push to `main`.

---

## 🔑 Business Rules

- **No patient accounts** — booking is a guest form (no login required).
- **Appointments auto-confirmed** — no doctor approval step needed.
- **60-minute default slots** — configurable in dashboard Settings.
- **Working hours:** Monday–Saturday, 9:00 AM – 6:00 PM.
- **Slot availability** = working hours − booked appointments − blocked slots.
- **Invoice format:** `INV-YYYYMMDD-XXX` (auto-generated).
- **WhatsApp notifications** sent on booking and reschedule (via AiSensy).

---

## 📄 License

This project is proprietary software built for Dr. Mansi Vishwakarma's physiotherapy practice.

---

## 👩‍⚕️ About

**Dr. Mansi Vishwakarma**  
BPT, MPT (Ortho) · Consultant Physiotherapist  
Nagpur, Maharashtra, India
