import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

const localitiesKeys = [
  'dharampeth',
  'sitabuldi',
  'ramdaspeth',
  'civilLines',
  'bajajNagar',
  'pratapNagar',
  'manishNagar',
  'shankarNagar',
  'hingna',
  'wardhaRoad',
  'katolRoad',
  'amravatiRoad',
] as const;

export default function AreasGrid() {
  const t = useTranslations('areas');
  const locale = useLocale();

  return (
    <section className="bg-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main City Card */}
        <div className="mb-8 flex items-center gap-3 rounded-card border-2 border-primary bg-primary-lightest p-6 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary sm:text-2xl">
              {t('allNagpur')}
            </h2>
          </div>
        </div>

        {/* Localities Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {localitiesKeys.map((key) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-card border border-border bg-surface p-4 shadow-sm transition-all hover:border-primary-light hover:shadow-md"
            >
              <MapPin className="h-5 w-5 shrink-0 text-primary" />
              <span className="font-medium text-text-primary">
                {t(`localities.${key}`)}
              </span>
            </div>
          ))}
        </div>

        {/* Not Listed & CTA */}
        <div className="mt-16 rounded-[24px] bg-surface-dark px-6 py-12 text-center shadow-lg sm:px-12 sm:py-16">
          <p className="mx-auto max-w-2xl text-lg font-medium text-text-on-dark sm:text-xl">
            {t('notListed')}
          </p>
          <div className="mt-8">
            <Link
              href={`/${locale}/book`}
              className="inline-flex items-center justify-center rounded-btn bg-primary-light px-8 py-3.5 text-sm font-bold text-primary transition-colors hover:bg-white"
            >
              {t('bookNow')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
