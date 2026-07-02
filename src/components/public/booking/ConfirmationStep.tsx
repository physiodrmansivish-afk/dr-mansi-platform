import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useBooking } from './BookingContext';
import { format } from 'date-fns';
import { CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ConfirmationStep() {
  const t = useTranslations('booking');
  const tServices = useTranslations('services');
  const { form, prevStep } = useBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const values = form.getValues();
  const serviceTitle = values.service ? tServices(`offerings.${values.service}.title`) : '';
  const dateFormatted = values.date ? format(values.date, 'EEEE, MMM dd, yyyy') : '';

  const handlePaymentAndConfirm = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        patient: {
          fullName: values.fullName,
          phone: values.phone,
          address: values.address,
          area: values.area,
          notes: values.notes,
        },
        appointment: {
          date: values.date ? format(values.date, 'yyyy-MM-dd') : '',
          time: values.time,
          service: values.service,
        },
        amount: 1000 // Fixed fee as per design
      };

      const res = await axios.post('/api/payments/initiate', payload);
      
      if (res.data && res.data.success && res.data.paytmParams) {
        const { paytmParams, actionUrl } = res.data;
        
        // Dynamically create a form to submit to Paytm
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = actionUrl;

        Object.keys(paytmParams).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = paytmParams[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        alert('Failed to initiate payment. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Failed to confirm booking', error);
      alert('An error occurred while confirming your booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-text">{t('summary.title')}</h2>
        <p className="text-text-muted">{t('summary.subtitle')}</p>
      </div>

      <div className="mb-8 overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border bg-surface-secondary px-6 py-4">
          <h3 className="text-lg font-semibold text-text">{t('summary.boxTitle')}</h3>
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            <div>
              <p className="mb-1 text-xs font-semibold tracking-wider text-text-muted">
                {t('summary.patientName')}
              </p>
              <p className="font-medium text-text">{values.fullName}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold tracking-wider text-text-muted">
                {t('summary.phone')}
              </p>
              <p className="font-medium text-text">+91 {values.phone}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold tracking-wider text-text-muted">
                {t('summary.dateTime')}
              </p>
              <p className="font-medium text-text">
                {dateFormatted} | {values.time}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold tracking-wider text-text-muted">
                {t('summary.service')}
              </p>
              <p className="font-medium text-text">{serviceTitle}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="mb-1 text-xs font-semibold tracking-wider text-text-muted">
                {t('summary.address')}
              </p>
              <p className="font-medium text-text">{values.address}</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between rounded-lg bg-surface-secondary p-4">
            <span className="font-semibold text-text">{t('summary.fee')}</span>
            <span className="text-xl font-bold text-primary">₹1000</span>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-primary bg-surface p-6 shadow-sm">
           <div className="font-bold text-[#002970] text-xl">Pay<span className="text-[#00BAF2]">tm</span></div>
           <span className="font-medium text-text text-sm">({t('actions.payNow')})</span>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 border-t border-border pt-6">
        <button
          type="button"
          onClick={handlePaymentAndConfirm}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-lg bg-primary px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-70 sm:w-auto sm:min-w-[300px]"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            t('actions.confirm')
          )}
        </button>
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="text-sm font-semibold text-text-muted hover:text-text"
        >
          {t('actions.back')}
        </button>
      </div>
      
      <div className="mt-6 text-center text-sm text-text-muted">
        {t('summary.whatsappNote')}
      </div>
    </div>
  );
}
