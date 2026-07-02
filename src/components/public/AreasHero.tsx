import { useTranslations } from 'next-intl';

export default function AreasHero() {
  const t = useTranslations('areas');

  return (
    <section className="bg-surface-secondary py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-text-primary sm:text-4xl lg:text-5xl">
          {t('title')}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
          {t('subtitle')}
        </p>
      </div>
    </section>
  );
}
