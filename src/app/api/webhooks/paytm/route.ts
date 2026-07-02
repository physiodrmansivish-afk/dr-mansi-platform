import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { PaytmChecksum } from '@/lib/paytm/generateChecksum';
import { 
  getAppointmentWithPatient, 
  updateAppointment, 
  createPayment 
} from '@/lib/supabase/queries';
import { sendWhatsApp } from '@/lib/aisensy/sendMessage';
import { WHATSAPP_TEMPLATES } from '@/lib/aisensy/templates';
import { parse, format } from 'date-fns';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const paytmParams: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      paytmParams[key] = value.toString();
    });

    const paytmChecksum = paytmParams['CHECKSUMHASH'];
    const merchantKey = process.env.PAYTM_MERCHANT_KEY!;
    
    // 1. Verify Checksum
    const isVerifySignature = PaytmChecksum.verifySignature(paytmParams, merchantKey, paytmChecksum);
    
    if (!isVerifySignature) {
      console.error('Checksum Mismatch in Paytm Webhook', paytmParams);
      // Even on failure, redirect to failure page
      return NextResponse.redirect(new URL('/en/book?status=payment_failed', request.url), 302);
    }

    const appointmentId = paytmParams['MERC_UNQ_REF'];
    const txStatus = paytmParams['STATUS'];
    const orderId = paytmParams['ORDERID'];
    const txnId = paytmParams['TXNID'];
    const amount = parseFloat(paytmParams['TXNAMOUNT']);

    const supabase = await createAdminClient();

    if (!appointmentId) {
      console.error('Missing MERC_UNQ_REF (appointment_id) in Paytm webhook payload');
      return NextResponse.redirect(new URL('/en/book?status=payment_failed', request.url), 302);
    }

    const appointment = await getAppointmentWithPatient(supabase, appointmentId);

    if (!appointment) {
      console.error('Appointment not found for ID:', appointmentId);
      return NextResponse.redirect(new URL('/en/book?status=payment_failed', request.url), 302);
    }

    // Generate refId for UI display
    const refId = 'PC-' + appointment.id.split('-')[0].toUpperCase();

    if (txStatus === 'TXN_SUCCESS') {
      // 2. Mark Appointment as Paid
      await updateAppointment(supabase, appointmentId, {
        payment_status: 'paid',
      });

      // 3. Create Payment Record
      const { createInvoice } = await import('@/lib/supabase/queries');
      // Create a plain receipt invoice
      const invoice = await createInvoice(supabase, {
        invoice_number: `INV-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        patient_id: appointment.patient_id,
        appointment_id: appointment.id,
        line_items: [{ description: 'Physiotherapy Consultation (Online Booking)', amount: amount }],
        subtotal: amount,
        total: amount,
        status: 'paid',
        issue_date: format(new Date(), 'yyyy-MM-dd'),
        due_date: format(new Date(), 'yyyy-MM-dd'),
        notes: 'Online payment via Paytm',
      });

      await createPayment(supabase, {
        invoice_id: invoice.id,
        amount: amount,
        method: 'paytm',
        paytm_order_id: orderId,
        paytm_txn_id: txnId,
        status: 'success',
        paid_at: new Date().toISOString(),
      });

      // 4. Send WhatsApp Confirmation
      const patientTemplate = appointment.patient.language_preference === 'mr' 
        ? WHATSAPP_TEMPLATES.BOOKING_CONFIRMATION_PATIENT_MR 
        : WHATSAPP_TEMPLATES.BOOKING_CONFIRMATION_PATIENT;
        
      const formattedDateForSms = format(parse(appointment.appointment_date, 'yyyy-MM-dd', new Date()), 'EEEE, dd MMMM yyyy');
      const formattedTime = format(parse(appointment.start_time, 'HH:mm:ss', new Date()), 'hh:mm a');

      sendWhatsApp({
        phone: appointment.patient.phone,
        templateName: patientTemplate,
        params: [
          appointment.patient.full_name,
          formattedDateForSms,
          formattedTime,
          appointment.patient.area,
          refId
        ],
        recipientType: 'patient',
        messageType: 'booking_confirmation'
      });

      const doctorPhone = process.env.DOCTOR_WHATSAPP_NUMBER || '919000012345';
      sendWhatsApp({
        phone: doctorPhone,
        templateName: WHATSAPP_TEMPLATES.BOOKING_NOTIFICATION_DOCTOR,
        params: [
          appointment.patient.full_name,
          appointment.patient.phone,
          formattedDateForSms,
          formattedTime,
          appointment.patient.area,
          'Physiotherapy Consultation', 
          refId
        ],
        recipientType: 'doctor',
        messageType: 'booking_confirmation'
      });

      // 5. Redirect to success page
      const locale = appointment.patient.language_preference || 'en';
      return NextResponse.redirect(new URL(`/${locale}/book?status=success&ref=${refId}`, request.url), 302);

    } else {
      console.warn('Paytm Payment Failed', paytmParams);
      const locale = appointment.patient.language_preference || 'en';
      return NextResponse.redirect(new URL(`/${locale}/book?status=payment_failed`, request.url), 302);
    }

  } catch (error: any) {
    console.error('Error handling Paytm webhook:', error);
    return NextResponse.redirect(new URL('/en/book?status=payment_error', request.url), 302);
  }
}
