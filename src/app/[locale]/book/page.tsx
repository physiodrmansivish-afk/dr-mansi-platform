import { getTranslations } from 'next-intl/server';
import { BookingProvider } from '@/components/public/booking/BookingContext';
import BookingForm from '@/components/public/booking/BookingForm';
import { Metadata } from 'next';

interface BookPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('bookTitle'),
    description: t('bookDescription'),
    openGraph: {
      title: t('bookTitle'),
      description: t('bookDescription'),
    },
  };
}

export default async function BookPage(props: BookPageProps) {
  const params = await props.params;

  // Preload translations for the page
  await getTranslations({ locale: params.locale, namespace: 'booking' });

  return (
    <main className="min-h-screen bg-surface-secondary pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BookingProvider>
          <BookingForm />
        </BookingProvider>
      </div>
    </main>
  );
}
