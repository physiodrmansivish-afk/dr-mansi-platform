'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function BookingSuccess() {
  const t = useTranslations('booking');

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
        </div>

        {/* Title */}
        <h2 className="mb-3 text-3xl font-bold text-text">{t('success.title')}</h2>

        {/* Subtitle */}
        <p className="mb-8 max-w-md text-lg text-text-muted">
          {t('success.subtitle')}
        </p>

        {/* WhatsApp Note */}
        <div className="mb-8 flex items-center justify-center gap-2 rounded-lg bg-green-50 px-5 py-3 text-sm text-green-700">
          <MessageCircle className="h-4 w-4" />
          {t('success.whatsappNote')}
        </div>

        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex justify-center rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          {t('success.backToHome')}
        </Link>
      </div>
    </div>
  );
}
