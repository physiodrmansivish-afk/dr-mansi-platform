import { useTranslations } from 'next-intl';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function BookingFailure() {
  const t = useTranslations('booking');

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-16 w-16 text-red-600" />
        </div>
        <h2 className="mb-4 text-3xl font-bold text-text">Payment Failed</h2>
        
        <div className="w-full rounded-xl border border-border bg-surface p-6 text-left shadow-sm sm:p-8 text-center">
          <p className="text-lg text-text">Unfortunately, your payment could not be processed.</p>
          <p className="mt-2 text-text-muted">Any deducted amount will be refunded by your bank within 3-5 business days. Your appointment slot has been released.</p>
        </div>

        <div className="mt-8 flex w-full flex-col gap-4 sm:w-auto">
          <Link
            href="/book"
            className="inline-flex w-full justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover sm:w-auto"
          >
            Try Booking Again
          </Link>
        </div>
      </div>
    </div>
  );
}
