import AboutHero from '@/components/public/AboutHero';
import AboutBio from '@/components/public/AboutBio';
import AboutStats from '@/components/public/AboutStats';
import AboutCta from '@/components/public/AboutCta';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('aboutTitle'),
    description: t('aboutDescription'),
    openGraph: {
      title: t('aboutTitle'),
      description: t('aboutDescription'),
    },
  };
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutBio />
      <AboutStats />
      <AboutCta />
    </>
  );
}
