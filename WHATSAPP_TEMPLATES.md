# WhatsApp Message Templates
# Dr. Mansi Vishwakarma — Physiotherapy Platform

These are the AiSensy message templates to submit for Meta approval before launch.
Template names are referenced in the codebase.

***

## Template 1: booking_confirmation_patient

**Template Name:** `booking_confirmation_patient`  
**Language:** English  
**Category:** UTILITY  
**Recipients:** Patient

**Body:**
```
Hello {{1}}, your physiotherapy appointment with Dr. Mansi Vishwakarma has been confirmed.

Date: {{2}}
Time: {{3}}
Area: {{4}}
Appointment ID: {{5}}

For rescheduling or cancellation, please contact us.
Thank you!
```

**Parameters:**
1. Patient full name
2. Appointment date (e.g., Monday, 30 June 2026)
3. Appointment time (e.g., 10:00 AM)
4. Area
5. Appointment ID

***

## Template 2: booking_confirmation_patient_mr

**Template Name:** `booking_confirmation_patient_mr`  
**Language:** Marathi  
**Category:** UTILITY  
**Recipients:** Marathi-preference patients

**Body:**
```
नमस्ते {{1}}, डॉ. मानसी विश्वकर्मा यांच्याकडे तुमची फिजिओथेरपी अपॉइंटमेंट निश्चित झाली आहे.

तारीख: {{2}}
वेळ: {{3}}
क्षेत्र: {{4}}
अपॉइंटमेंट आयडी: {{5}}

बदल किंवा रद्द करण्यासाठी संपर्क करा.
धन्यवाद!
```

***

## Template 3: booking_notification_doctor

**Template Name:** `booking_notification_doctor`  
**Language:** English  
**Category:** UTILITY  
**Recipients:** Dr. Mansi (doctor's WhatsApp number)

**Body:**
```
New Appointment Booked 🗓️

Patient: {{1}}
Phone: {{2}}
Date: {{3}}
Time: {{4}}
Area: {{5}}
Service: {{6}}
Appointment ID: {{7}}
```

***

## Template 4: reschedule_notification_patient

**Template Name:** `reschedule_notification_patient`  
**Language:** English  
**Category:** UTILITY  
**Recipients:** Patient

**Body:**
```
Hello {{1}}, your appointment has been rescheduled.

New Date: {{2}}
New Time: {{3}}
Area: {{4}}
Appointment ID: {{5}}

If you have questions, please contact us.
Thank you!
```

***

## Notes for Developer

- All templates must be submitted via AiSensy dashboard before going live.
- Template name strings are stored in src/lib/aisensy/templates.ts.
- The sendWhatsApp function in src/lib/aisensy/sendMessage.ts uses these template names.
- For the Marathi template, check patient.language_preference === 'mr' and use the Marathi template accordingly.
- Doctor notification always goes in English regardless of patient language.