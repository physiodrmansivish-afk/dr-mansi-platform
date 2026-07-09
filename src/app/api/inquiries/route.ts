import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendWhatsApp } from '@/lib/aisensy/sendMessage';
import { WHATSAPP_TEMPLATES } from '@/lib/aisensy/templates';

const inquirySchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  age: z.number().int().min(1).max(120),
  sex: z.enum(['male', 'female', 'other']),
  phone: z.string().min(10).max(10).regex(/^[0-9]+$/),
  area: z.string().min(1, 'Area is required'),
  service: z.string().min(1, 'Service is required'),
  address: z.string().min(1, 'Address is required'),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate payload
    const validationResult = inquirySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { fullName, age, sex, phone, area, service, address, notes } = validationResult.data;

    // 2. Send WhatsApp to Dr. Mansi with patient details
    const doctorPhone = process.env.DOCTOR_WHATSAPP_NUMBER || '';

    if (doctorPhone) {
      sendWhatsApp({
        phone: doctorPhone,
        templateName: WHATSAPP_TEMPLATES.PATIENT_INQUIRY_DOCTOR,
        params: [
          fullName,
          `${age}`,
          sex.charAt(0).toUpperCase() + sex.slice(1),
          phone,
          area,
          service,
          address,
          notes || 'No additional notes',
        ],
        recipientType: 'doctor',
        messageType: 'booking_confirmation',
      });
    } else {
      console.warn('DOCTOR_WHATSAPP_NUMBER is not set. Skipping WhatsApp notification to doctor.');
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Error processing inquiry:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
