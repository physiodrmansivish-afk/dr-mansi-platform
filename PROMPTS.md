# Page-by-Page Antigravity Agent Prompts
# Dr. Mansi Vishwakarma — Physiotherapy Platform

***

## HOW TO USE

1. Open Antigravity IDE.
2. Open the relevant design image from /designs in the editor sidebar.
3. Copy the prompt below for the page you want to build.
4. Paste it into the Antigravity Agent chat.
5. Click Proceed when the agent shows you the implementation plan.
6. Review the output, then move to the next prompt.

***

***

## PROMPT 01 — Project Setup & Supabase Schema

```
Read agents.md carefully.

Task: Initialize the complete project foundation.

Steps:
1. Create the Supabase project configuration in src/lib/supabase/client.ts and src/lib/supabase/server.ts using @supabase/ssr.
2. Create src/types/index.ts with full TypeScript interfaces for: Patient, Appointment, AppointmentHistory, BlockedSlot, Invoice, Payment, WhatsAppLog — matching the schema in agents.md exactly.
3. Create src/lib/supabase/queries.ts with typed query functions for all CRUD operations on every table.
4. Create src/middleware.ts for next-intl locale routing (en and mr, default en).
5. Create src/messages/en.json and src/messages/mr.json with placeholder keys for all public pages: nav, home, about, services, areas, booking, contact, common.
6. Create .env.local with all environment variable keys from agents.md (empty values).
7. Create the full folder structure from agents.md.

Do not build any UI yet. This task is infrastructure only.
```

***

## PROMPT 02 — Public Website: Home Page

```
Read agents.md.
Open design image: /designs/home-page.png — study it carefully before writing any code.

Task: Build the public Home page at src/app/[locale]/page.tsx

Requirements:
- Match the design in /designs/home-page.png exactly. Do not invent any layout.
- Use next-intl for all text strings.
- Components to build:
  - Navbar with logo, navigation links, language toggle (EN/MR), and Book Appointment CTA button.
  - Hero section with headline, subheadline, and primary CTA.
  - About snippet section.
  - Services preview section (cards).
  - Areas we serve section.
  - Testimonials section if shown in design.
  - Footer with contact info and links.
- All components go in src/components/public/.
- Navbar and Footer are shared — place them in src/components/shared/ and wrap with a layout.
- The language toggle must switch between /en/ and /mr/ routes using next-intl.
- Every section must be fully responsive: mobile-first, verified at 375px and 1280px.
- No hardcoded strings — use translation keys.
```

***

## PROMPT 03 — Public Website: About Page

```
Read agents.md.
Open design image: /designs/about-page.png — study it carefully before writing any code.

Task: Build src/app/[locale]/about/page.tsx

Requirements:
- Match /designs/about-page.png pixel-accurately.
- Show Dr. Mansi's qualifications: BPT, MPT (Ortho), Consultant Physiotherapist.
- Include professional photo placeholder (use next/image with a placeholder).
- Show bio, specializations, and certifications as per design.
- All text uses next-intl translation keys.
- Fully responsive.
```

***

## PROMPT 04 — Public Website: Services Page

```
Read agents.md.
Open design image: /designs/services-page.png — study it before writing any code.

Task: Build src/app/[locale]/services/page.tsx

Requirements:
- Match /designs/services-page.png exactly.
- Display all services offered with name, description, and duration.
- Each service card should have a Book Now button that links to /[locale]/book with the service pre-selected as a query param (?service=SERVICE_NAME).
- All text via next-intl.
- Fully responsive.
```

***

## PROMPT 05 — Public Website: Areas We Serve Page

```
Read agents.md.
Open design image: /designs/areas-page.png — study it before writing any code.

Task: Build src/app/[locale]/areas/page.tsx

Requirements:
- Match /designs/areas-page.png exactly.
- List all serviceable areas/localities clearly.
- Add a note that home visits are provided only in listed areas.
- All text via next-intl.
- Fully responsive.
```

***

## PROMPT 06 — Public Website: Booking Page

```
Read agents.md.
Open design image: /designs/booking-page.png — study every detail before writing any code.

Task: Build src/app/[locale]/book/page.tsx — this is the most critical public page.

Requirements:
- Match /designs/booking-page.png exactly.
- Multi-step booking form with these steps:
  Step 1 — Select Service and Area:
    - Service dropdown (loaded from a static config file).
    - Area dropdown (only serviceable areas — loaded from static config).
  Step 2 — Select Date and Time Slot:
    - Date picker (react-day-picker). Disable Sundays and past dates.
    - On date selection, fetch available slots from /api/appointments/available-slots?date=YYYY-MM-DD.
    - Available slots = working hours minus booked appointments minus blocked slots for that date.
    - Show available slots as selectable time buttons.
    - Show "No slots available" state if all slots are blocked.
  Step 3 — Patient Details:
    - Fields: Full Name (required), Phone Number (required, 10-digit validation), Address (required), Notes (optional).
    - All validated with React Hook Form + Zod.
  Step 4 — Confirmation & Payment:
    - Show booking summary.
    - Paytm Pay Now button.
    - On successful payment: call /api/appointments (POST) to create the appointment and trigger WhatsApp messages.
    - Show booking confirmation screen with appointment ID.
- Form state managed with React Hook Form.
- Each step validates before proceeding to next.
- Fully responsive. Mobile-first.
- All text via next-intl.
```

***

## PROMPT 07 — API: Available Slots + Appointment Creation

```
Read agents.md.

Task: Build the appointment-related API routes.

1. GET /api/appointments/available-slots
   - Query param: date (YYYY-MM-DD, required).
   - Logic:
     a. Generate all slots for that date using working hours config (9:00–17:00, 60-min intervals).
     b. Fetch booked appointments for that date from Supabase.
     c. Fetch blocked_slots for that date from Supabase.
     d. Return available slots = all slots MINUS booked MINUS blocked.
   - Response: { slots: ["09:00", "10:00", ...] }
   - Validate date with Zod.

2. POST /api/appointments
   - Body: { patientName, phone, address, area, service, appointmentDate, startTime, notes? }
   - Logic:
     a. Validate body with Zod.
     b. Check slot is still available (race condition guard).
     c. Upsert patient record (match by phone number).
     d. Create appointment record.
     e. Call src/lib/aisensy/sendMessage.ts to send WhatsApp confirmation to patient and doctor.
     f. Return { success: true, appointmentId }.
   - All DB operations via src/lib/supabase/queries.ts.

3. Create src/lib/aisensy/sendMessage.ts:
   - Function: sendWhatsApp(phone, templateName, params)
   - Uses AISENSY_API_KEY from env.
   - Posts to AiSensy REST API.
   - Logs result to whatsapp_logs table.
   - Handle errors gracefully — appointment should still be created even if WhatsApp fails.
```

***

## PROMPT 08 — Paytm Payment Integration

```
Read agents.md.

Task: Integrate Paytm Payment Gateway.

1. Create src/lib/paytm/generateChecksum.ts:
   - Implement Paytm checksum generation using PAYTM_MERCHANT_KEY.
   - Use the official Paytm checksum utility logic.

2. Create POST /api/payments/initiate:
   - Body: { appointmentData, amount }
   - Generate Paytm order ID (format: ORDER-timestamp-random).
   - Generate checksum.
   - Return Paytm payment parameters for client-side form submission.

3. Create POST /api/webhooks/paytm:
   - Receive Paytm payment callback.
   - Verify checksum.
   - On success: create appointment (call the appointment creation logic), record payment, send WhatsApp.
   - On failure: return error.
   - Log all events.

4. Update the Booking Page (Prompt 06) to:
   - Call /api/payments/initiate to get Paytm params.
   - Submit the Paytm payment form.
   - Handle return URL to show confirmation page.

Use PAYTM_MERCHANT_ID, PAYTM_MERCHANT_KEY, PAYTM_WEBSITE, PAYTM_CHANNEL_ID, PAYTM_INDUSTRY_TYPE_ID, PAYTM_CALLBACK_URL from env.
```

***

## PROMPT 09 — Dashboard: Auth & Shell Layout

```
Read agents.md.
Open design image: /designs/dashboard-shell.png — study it before writing any code.

Task: Build the doctor dashboard foundation.

1. Supabase Auth setup:
   - Doctor login only (single user — Dr. Mansi).
   - Create src/app/dashboard/login/page.tsx — email + password login form.
   - Middleware protection: redirect to /dashboard/login if not authenticated.
   - Use Supabase Auth with @supabase/ssr.

2. Dashboard shell layout src/app/dashboard/layout.tsx:
   - Match /designs/dashboard-shell.png exactly.
   - Sidebar navigation with links: Overview, Appointments, Availability, Patients, Invoices, Settings.
   - Header with doctor name, date, and logout button.
   - Main content area.
   - On mobile: sidebar collapses to a hamburger menu with slide-in drawer.
   - Active nav item highlighted.
```

***

## PROMPT 10 — Dashboard: Overview Page

```
Read agents.md.
Open design image: /designs/dashboard-overview.png — study it before writing any code.

Task: Build src/app/dashboard/page.tsx

Requirements:
- Match /designs/dashboard-overview.png exactly.
- KPI cards: Today's Appointments, Pending Payments, Total Patients, This Month's Revenue.
- Today's appointment list with patient name, time, area, and status badge.
- Upcoming appointments (next 7 days) list or mini calendar.
- All data fetched server-side using Supabase server client.
- KPI numbers use animated count-up (Recharts or CSS counter).
- Fully responsive.
```

***

## PROMPT 11 — Dashboard: Appointments Module

```
Read agents.md.
Open design image: /designs/dashboard-appointments.png — study it before writing any code.

Task: Build src/app/dashboard/appointments/page.tsx

Requirements:
- Match /designs/dashboard-appointments.png exactly.
- Calendar view (monthly) showing appointments as events. Toggle to list view.
- Appointment list with filters: date range, status, area.
- Each appointment row shows: patient name, date, time, area, status badge, payment badge, actions.
- Actions: View Details, Reschedule, Mark Completed, Mark No-Show, Cancel.
- Reschedule modal:
  - Date picker + available slot selector.
  - On confirm: update appointment, create appointment_history record, send WhatsApp to patient.
- Appointment detail drawer/modal showing full patient and visit info.
- Status badges: color-coded (booked=blue, completed=green, rescheduled=orange, cancelled=red, no_show=gray).
```

***

## PROMPT 12 — Dashboard: Availability Blocking

```
Read agents.md.
Open design image: /designs/dashboard-availability.png — study it before writing any code.

Task: Build src/app/dashboard/availability/page.tsx

Requirements:
- Match /designs/dashboard-availability.png exactly.
- Weekly calendar view showing:
  - Booked slots (read-only, from appointments table).
  - Blocked slots (from blocked_slots table).
  - Available slots (remaining).
- Doctor can click any available slot to block it.
- Block slot form: date, start time, end time, optional reason.
- Doctor can click a blocked slot to unblock it.
- Block entire day button.
- Changes reflect immediately (optimistic UI update).
- API routes: POST /api/availability/block, DELETE /api/availability/block/[id].
```

***

## PROMPT 13 — Dashboard: Patients Module

```
Read agents.md.
Open design image: /designs/dashboard-patients.png — study it before writing any code.

Task: Build src/app/dashboard/patients/page.tsx and src/app/dashboard/patients/[id]/page.tsx

Requirements:
- Match /designs/dashboard-patients.png exactly.
- Patients list with search by name or phone, filter by area.
- Each row: name, phone, area, total visits, last visit date.
- Patient detail page:
  - Profile info: name, phone, address, area, notes.
  - Full visit history (all appointments) with status and payment info.
  - Invoice list for this patient.
  - Add/edit notes field.
  - Create Invoice button.
```

***

## PROMPT 14 — Dashboard: Invoices Module

```
Read agents.md.
Open design image: /designs/dashboard-invoices.png — study it before writing any code.

Task: Build src/app/dashboard/invoices/page.tsx

Requirements:
- Match /designs/dashboard-invoices.png exactly.
- Invoices list with filters: status (unpaid/paid/partial), date range, patient name.
- Each row: invoice number, patient name, date, amount, status badge, actions.
- Create Invoice modal/page:
  - Select patient (search dropdown).
  - Select linked appointment (optional).
  - Line items: add/remove rows with description and amount.
  - Auto-calculated subtotal, discount, total.
  - Issue date, due date, notes.
  - Save as draft or issue immediately.
- Invoice detail view with all line items.
- Mark as Paid button → opens payment entry: amount, method (cash/UPI/Paytm/bank), reference.
- Payment recorded in payments table, invoice status updated.
- Invoice number auto-generated as INV-YYYYMMDD-XXX.
```

***

## PROMPT 15 — Dashboard: Settings Page

```
Read agents.md.
Open design image: /designs/dashboard-settings.png — study it before writing any code.

Task: Build src/app/dashboard/settings/page.tsx

Requirements:
- Match /designs/dashboard-settings.png exactly.
- Sections:
  1. Working Hours: set working days, start time, end time, slot duration.
  2. Service Areas: add/remove serviceable localities.
  3. Services: add/remove/edit services with name, description, duration, price.
  4. Clinic Info: name, phone, WhatsApp number, address (used in notifications and invoices).
  5. WhatsApp Templates: show configured template names for booking/reschedule messages.
- All settings stored in a settings table in Supabase or a config JSON.
- Changes save immediately with success toast.
```

***

## PROMPT 16 — Polish, Responsive QA, and Error States

```
Read agents.md.

Task: Final polish pass across the entire application.

1. Ensure every public page is fully responsive at 375px (mobile), 768px (tablet), and 1280px (desktop).
2. Ensure every dashboard module is usable on mobile (375px) — sidebar collapses, tables become cards, forms are touch-friendly.
3. Add loading skeletons to every data-fetching component.
4. Add empty states to: appointments list, patients list, invoices list, availability calendar.
5. Add error boundaries to all pages.
6. Test and fix the language toggle across all public pages — ensure all strings are translated in both en.json and mr.json.
7. Add toast notifications for all success and error actions across the dashboard.
8. Verify all form validations show proper error messages.
9. Test the full booking flow end-to-end: select slot → fill form → pay → confirmation → WhatsApp sent → appointment appears in dashboard.
```