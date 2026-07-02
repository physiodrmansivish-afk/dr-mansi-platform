import { useTranslations } from 'next-intl';

export default function ServicesHeader() {
  const t = useTranslations('services');

  return (
    <section className="bg-surface-secondary py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-text-primary sm:text-4xl lg:text-5xl">
          Our <span className="relative inline-block">
            Services
            <span className="absolute -bottom-2 left-0 h-1 w-full bg-primary" />
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-base text-text-secondary sm:text-lg">
          {t('subtitle')}
        </p>
      </div>
    </section>
  );
}
