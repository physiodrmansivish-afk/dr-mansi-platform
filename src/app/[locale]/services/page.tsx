import ServicesHeader from '@/components/public/ServicesHeader';
import ServicesGrid from '@/components/public/ServicesGrid';
import ServicesCta from '@/components/public/ServicesCta';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('servicesTitle'),
    description: t('servicesDescription'),
    openGraph: {
      title: t('servicesTitle'),
      description: t('servicesDescription'),
    },
  };
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <ServicesHeader />
      <ServicesGrid />
      <ServicesCta />
    </main>
  );
}
