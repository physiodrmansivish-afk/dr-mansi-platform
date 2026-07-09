import AreasHero from '@/components/public/AreasHero';
import AreasGrid from '@/components/public/AreasGrid';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('areasTitle'),
    description: t('areasDescription'),
    openGraph: {
      title: t('areasTitle'),
      description: t('areasDescription'),
    },
  };
}

export default function AreasPage() {
  return (
    <>
      <AreasHero />
      <AreasGrid />
    </>
  );
}
