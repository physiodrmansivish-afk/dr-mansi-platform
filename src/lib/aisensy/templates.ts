export const WHATSAPP_TEMPLATES = {
  BOOKING_CONFIRMATION_PATIENT: 'booking_confirmation_patient',
  BOOKING_CONFIRMATION_PATIENT_MR: 'booking_confirmation_patient_mr',
  BOOKING_NOTIFICATION_DOCTOR: 'booking_notification_doctor',
  RESCHEDULE_NOTIFICATION_PATIENT: 'reschedule_notification_patient',
} as const;

export type WhatsAppTemplate = (typeof WHATSAPP_TEMPLATES)[keyof typeof WHATSAPP_TEMPLATES];
