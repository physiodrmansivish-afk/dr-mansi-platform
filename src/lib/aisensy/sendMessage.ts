import axios from 'axios';
import { WhatsAppTemplate } from './templates';
import { WhatsAppRecipientType, WhatsAppMessageType } from '@/types';

interface SendWhatsAppParams {
  phone: string;
  templateName: WhatsAppTemplate;
  params: string[];
  recipientType: WhatsAppRecipientType;
  messageType: WhatsAppMessageType;
}

export async function sendWhatsApp({
  phone,
  templateName,
  params,
  recipientType,
  messageType,
}: SendWhatsAppParams) {
  const apiKey = process.env.AISENSY_API_KEY;

  if (!apiKey) {
    console.warn('AISENSY_API_KEY is not set. Skipping WhatsApp message.');
    return;
  }

  // Sanitize phone number (remove +, spaces, etc)
  const cleanPhone = phone.replace(/\D/g, '');

  try {
    const payload = {
      apiKey: apiKey,
      campaignName: templateName,
      destination: cleanPhone,
      userName: 'Dr Mansi System',
      templateParams: params,
    };

    const response = await axios.post(
      'https://backend.aisensy.com/campaign/t1/api/v2',
      payload
    );

    if (response.data && response.data.success) {
      console.log(`WhatsApp message sent successfully to ${cleanPhone}`);
      return true;
    } else {
      console.error('AiSensy API error response:', response.data);
      return false;
    }
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error?.response?.data || error.message);
    return false; // Fail gracefully so it doesn't break the booking flow
  }
}
