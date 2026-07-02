import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function AboutCta() {
  const t = useTranslations('about');
  const locale = useLocale();

  return (
    <section className="bg-surface px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-7xl rounded-card bg-surface-secondary px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          {/* Text */}
          <div>
            <h3 className="text-lg font-bold text-text-primary sm:text-xl">
              {t('ctaTitle')}
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              {t('ctaSubtitle')}
            </p>
          </div>

          {/* CTA button */}
          <Link
            href={`/${locale}/book`}
            className="inline-flex shrink-0 items-center justify-center rounded-btn bg-primary px-6 py-3 text-sm font-semibold text-text-on-dark transition-colors hover:bg-primary-hover"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </div>
    </section>
  );
}
