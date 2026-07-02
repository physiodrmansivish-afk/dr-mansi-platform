import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { 
  getPatientByPhone, 
  createPatient, 
  updatePatient, 
  createAppointment,
  getAppointmentsByDate,
  getBlockedSlotsByDate
} from '@/lib/supabase/queries';
import { parse, format } from 'date-fns';
import { PaytmChecksum } from '@/lib/paytm/generateChecksum';

const initiatePaymentSchema = z.object({
  patient: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(10).max(10),
    address: z.string().min(1),
    area: z.string().min(1),
    notes: z.string().optional(),
  }),
  appointment: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().min(1),
    service: z.string().min(1),
  }),
  amount: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validate payload
    const validationResult = initiatePaymentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.format() }, { status: 400 });
    }
    
    const { patient, appointment, amount } = validationResult.data;
    const supabase = await createAdminClient();

    // 2. Check slot availability (race condition guard)
    const parsedTime = parse(appointment.time, 'hh:mm a', new Date());
    const dbStartTime = format(parsedTime, 'HH:mm:ss');
    const dbEndTime = format(parse(appointment.time, 'hh:mm a', new Date(parsedTime.getTime() + 60 * 60000)), 'HH:mm:ss');

    const [existingAppts, blockedSlots] = await Promise.all([
      getAppointmentsByDate(supabase, appointment.date),
      getBlockedSlotsByDate(supabase, appointment.date),
    ]);

    const isBooked = existingAppts.some(
      (appt) => appt.start_time === dbStartTime && appt.status !== 'cancelled' && appt.status !== 'rescheduled'
    );
    const isBlocked = blockedSlots.some((slot) => slot.start_time === dbStartTime);

    if (isBooked || isBlocked) {
      return NextResponse.json({ error: 'Slot is no longer available' }, { status: 409 });
    }

    // 3. Upsert Patient
    let patientRecord = await getPatientByPhone(supabase, patient.phone);
    if (patientRecord) {
      patientRecord = await updatePatient(supabase, patientRecord.id, {
        full_name: patient.fullName,
        address: patient.address,
        area: patient.area,
        notes: patient.notes || null,
      });
    } else {
      patientRecord = await createPatient(supabase, {
        full_name: patient.fullName,
        phone: patient.phone,
        alternate_phone: null,
        address: patient.address,
        area: patient.area,
        language_preference: 'en',
        notes: patient.notes || null,
      });
    }

    // 4. Create Appointment (Status: booked, Payment: unpaid)
    const appointmentRecord = await createAppointment(supabase, {
      patient_id: patientRecord.id,
      appointment_date: appointment.date,
      start_time: dbStartTime,
      end_time: dbEndTime,
      area: patient.area,
      status: 'booked',
      payment_status: 'unpaid',
      doctor_notes: null,
    });

    // 5. Generate Paytm Parameters
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const custId = `CUST-${patientRecord.id.replace(/-/g, '').slice(0, 10)}`;

    const paytmParams: Record<string, string> = {
      MID: process.env.PAYTM_MERCHANT_ID!,
      WEBSITE: process.env.PAYTM_WEBSITE!,
      INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE_ID!,
      CHANNEL_ID: process.env.PAYTM_CHANNEL_ID!,
      ORDER_ID: orderId,
      CUST_ID: custId,
      TXN_AMOUNT: amount.toFixed(2),
      CALLBACK_URL: process.env.PAYTM_CALLBACK_URL!,
      // We encode the appointment ID in MERC_UNQ_REF to safely link it in the webhook
      MERC_UNQ_REF: appointmentRecord.id,
    };

    const checksum = PaytmChecksum.generateSignature(paytmParams, process.env.PAYTM_MERCHANT_KEY!);
    paytmParams['CHECKSUMHASH'] = checksum;

    // Use staging or production URL based on env (using staging for dev)
    const actionUrl = process.env.NODE_ENV === 'production' 
      ? 'https://securegw.paytm.in/order/process'
      : 'https://securegw-stage.paytm.in/order/process';

    return NextResponse.json({ 
      success: true, 
      paytmParams,
      actionUrl,
      appointmentId: appointmentRecord.id 
    });

  } catch (error: any) {
    console.error('Error initiating payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
