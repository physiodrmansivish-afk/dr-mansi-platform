import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Bone, HeartPulse, Activity, Brain, PersonStanding, Timer } from 'lucide-react';

const serviceKeys = ['ortho', 'postSurgery', 'sports', 'neuro', 'elderly', 'chronic'] as const;

// Using relevant Lucide icons approximating the design icons
const icons = {
  ortho: Bone,
  postSurgery: HeartPulse,
  sports: Activity,
  neuro: Brain,
  elderly: PersonStanding,
  chronic: Timer,
};

export default function ServicesGrid() {
  const t = useTranslations('services');
  const locale = useLocale();

  return (
    <section className="bg-surface-secondary pb-16 sm:pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceKeys.map((key) => {
            const Icon = icons[key];
            return (
              <div
                key={key}
                className="flex flex-col justify-between rounded-card border border-border bg-surface p-6 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div>
                  {/* Icon */}
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-lg font-semibold text-text-primary">
                    {t(`items.${key}.title`)}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                    {t(`items.${key}.description`)}
                  </p>
                </div>

                <div>
                  {/* Price/Duration */}
                  <p className="mb-5 text-sm font-medium text-primary">
                    {t(`items.${key}.price`)}
                  </p>

                  {/* Book Now Button */}
                  <Link
                    href={`/${locale}/book?service=${key}`}
                    className="flex w-full items-center justify-center rounded-btn border border-border bg-surface py-2 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary-light"
                  >
                    {t('bookNow')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
