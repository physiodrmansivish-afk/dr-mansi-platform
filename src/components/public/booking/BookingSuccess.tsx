import { useTranslations } from 'next-intl';
import { CheckCircle2, Check } from 'lucide-react';
import Link from 'next/link';

export default function BookingSuccess({ refId }: { refId: string }) {
  const t = useTranslations('booking');

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-16 w-16 text-primary" />
        </div>
        <h2 className="mb-4 text-3xl font-bold text-text">{t('success.title')}</h2>
        
        {refId && (
          <div className="mb-8 inline-flex items-center rounded-full bg-surface-secondary px-4 py-1 text-sm font-medium text-text-muted">
            {t('success.refId')}: <span className="ml-1 font-bold text-primary">{refId}</span>
          </div>
        )}

        <div className="w-full rounded-xl border border-border bg-surface p-6 text-left shadow-sm sm:p-8 text-center">
          <p className="text-lg text-text">Your payment was successful and your appointment is confirmed!</p>
          <p className="mt-2 text-text-muted">A WhatsApp confirmation has been sent to your number.</p>
        </div>

        <div className="mt-8 flex w-full flex-col gap-4 sm:w-auto">
          <Link
            href="/"
            className="inline-flex w-full justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover sm:w-auto"
          >
            {t('success.backToHome')}
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          <Check className="h-4 w-4" />
          {t('success.whatsappSent')}
        </div>
      </div>
    </div>
  );
}
