import { useTranslations } from 'next-intl';

export default function AboutHero() {
  const t = useTranslations('about');

  return (
    <section className="bg-surface-secondary py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
          {t('heroTitle')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-text-muted sm:text-lg">
          {t('heroSubtitle')}
        </p>
      </div>
    </section>
  );
}
