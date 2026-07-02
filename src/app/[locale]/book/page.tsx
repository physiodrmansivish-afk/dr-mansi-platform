import { getTranslations } from 'next-intl/server';
import { BookingProvider } from '@/components/public/booking/BookingContext';
import BookingForm from '@/components/public/booking/BookingForm';
import BookingSuccess from '@/components/public/booking/BookingSuccess';
import BookingFailure from '@/components/public/booking/BookingFailure';

interface BookPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string; ref?: string }>;
}

export default async function BookPage(props: BookPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const t = await getTranslations({ locale: params.locale, namespace: 'booking' });

  return (
    <main className="min-h-screen bg-surface-secondary pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 hidden">
          <h1 className="text-4xl font-bold text-text sm:text-5xl">{t('title')}</h1>
          <p className="mt-4 text-lg text-text-muted">{t('subtitle')}</p>
        </div>
        
        {searchParams.status === 'success' ? (
          <BookingSuccess refId={searchParams.ref || ''} />
        ) : searchParams.status === 'payment_failed' ? (
          <BookingFailure />
        ) : (
          <BookingProvider>
            <BookingForm />
          </BookingProvider>
        )}
      </div>
    </main>
  );
}
