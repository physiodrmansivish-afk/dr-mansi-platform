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
import { sendWhatsApp } from '@/lib/aisensy/sendMessage';
import { WHATSAPP_TEMPLATES } from '@/lib/aisensy/templates';
import { parse, format } from 'date-fns';

const createAppointmentSchema = z.object({
  patient: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(10).max(10),
    address: z.string().min(1),
    area: z.string().min(1),
    notes: z.string().optional(),
  }),
  appointment: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().min(1), // e.g. "10:00 AM"
    service: z.string().min(1),
  })
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validate payload
    const validationResult = createAppointmentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.format() }, { status: 400 });
    }
    
    const { patient, appointment } = validationResult.data;
    const supabase = await createAdminClient();

    // 2. Check slot availability (race condition guard)
    // Convert "10:00 AM" to "HH:mm:ss"
    const parsedTime = parse(appointment.time, 'hh:mm a', new Date());
    const dbStartTime = format(parsedTime, 'HH:mm:ss');
    // Assume 60 min duration
    const dbEndTime = format(parse(appointment.time, 'hh:mm a', new Date(parsedTime.getTime() + 60 * 60000)), 'HH:mm:ss');

    const [existingAppts, blockedSlots] = await Promise.all([
      getAppointmentsByDate(supabase, appointment.date),
      getBlockedSlotsByDate(supabase, appointment.date),
    ]);

    const isBooked = existingAppts.some(
      (appt) => appt.start_time === dbStartTime && appt.status !== 'cancelled' && appt.status !== 'rescheduled'
    );
    const isBlocked = blockedSlots.some(
      (slot) => slot.start_time === dbStartTime
    );

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
        language_preference: 'en', // Defaulting to english since payload doesn't provide locale yet
        notes: patient.notes || null,
      });
    }

    // 4. Create Appointment
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

    // 5. Send WhatsApp notifications (in background / non-blocking)
    const formattedDateForSms = format(parse(appointment.date, 'yyyy-MM-dd', new Date()), 'EEEE, dd MMMM yyyy');
    
    // Send to Patient
    const patientTemplate = patientRecord.language_preference === 'mr' 
      ? WHATSAPP_TEMPLATES.BOOKING_CONFIRMATION_PATIENT_MR 
      : WHATSAPP_TEMPLATES.BOOKING_CONFIRMATION_PATIENT;
      
    sendWhatsApp({
      phone: patientRecord.phone,
      templateName: patientTemplate,
      params: [
        patientRecord.full_name,
        formattedDateForSms,
        appointment.time,
        patientRecord.area,
        appointmentRecord.id.slice(0, 8).toUpperCase()
      ],
      recipientType: 'patient',
      messageType: 'booking_confirmation'
    });

    // Send to Doctor (assuming doctor number is a config, maybe env var, using a dummy one for now)
    const doctorPhone = process.env.DOCTOR_WHATSAPP_NUMBER || '919000012345'; // Configurable
    sendWhatsApp({
      phone: doctorPhone,
      templateName: WHATSAPP_TEMPLATES.BOOKING_NOTIFICATION_DOCTOR,
      params: [
        patientRecord.full_name,
        patientRecord.phone,
        formattedDateForSms,
        appointment.time,
        patientRecord.area,
        appointment.service,
        appointmentRecord.id.slice(0, 8).toUpperCase()
      ],
      recipientType: 'doctor',
      messageType: 'booking_confirmation'
    });

    // 6. Return response
    // Generating a short refId for the UI from the uuid
    const refId = 'PC-' + appointmentRecord.id.split('-')[0].toUpperCase();

    return NextResponse.json({ 
      success: true, 
      refId: refId,
      appointmentId: appointmentRecord.id 
    });

  } catch (error: any) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
