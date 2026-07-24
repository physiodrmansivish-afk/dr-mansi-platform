import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Bone, HeartPulse, Activity } from 'lucide-react';

const serviceIcons = [Bone, HeartPulse, Activity] as const;
const serviceKeys = ['ortho', 'postSurgery', 'sports'] as const;

export default function ServicesSection() {
  const t = useTranslations('home.services');
  const locale = useLocale();

  return (
    <section className="bg-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            {t('title')}
          </h2>
          <div className="mx-auto mt-2 h-0.5 w-12 bg-primary" />
        </div>

        {/* Cards grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceKeys.map((key, index) => {
            const Icon = serviceIcons[index];
            return (
              <div
                key={key}
                className="group rounded-card border border-border bg-surface p-6 sm:p-8 shadow-card transition-shadow hover:shadow-card-hover"
              >
                {/* Icon */}
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-text-primary">
                  {t(`items.${key}.title`)}
                </h3>

                {/* Description */}
                <p className="mb-4 text-base leading-relaxed text-text-muted">
                  {t(`items.${key}.description`)}
                </p>

                {/* Learn More link */}
                <Link
                  href={`/${locale}/services`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:text-primary-hover"
                >
                  {t('learnMore')}
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
