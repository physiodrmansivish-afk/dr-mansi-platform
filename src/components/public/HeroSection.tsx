import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function HeroSection() {
  const t = useTranslations('home.hero');
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-surface-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="max-w-xl">
          {/* Badge */}
          <span className="mb-4 inline-block rounded-badge bg-primary-light px-4 py-1.5 text-xs font-semibold text-primary">
            {t('badge')}
          </span>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {t('titleLine1')}
            <br />
            <span className="text-primary">{t('titleLine2')}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-lg font-medium text-text-secondary sm:text-xl">
            {t('subtitle')}
          </p>

          {/* Description */}
          <p className="mt-3 max-w-md text-sm leading-relaxed text-text-muted sm:text-base">
            {t('description')}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href={`/${locale}/book`}
              className="inline-flex items-center justify-center rounded-btn bg-primary px-6 py-3 text-sm font-semibold text-text-on-dark shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-primary"
            >
              {t('ctaPrimary')}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center justify-center rounded-btn border border-primary bg-transparent px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-light"
            >
              {t('ctaSecondary')}
            </Link>
          </div>

          {/* Trust badge */}
          <div className="mt-10 flex items-center gap-3">
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              <span className="inline-block h-8 w-8 rounded-full border-2 border-surface bg-primary/20" />
              <span className="inline-block h-8 w-8 rounded-full border-2 border-surface bg-primary/30" />
              <span className="inline-block h-8 w-8 rounded-full border-2 border-surface bg-success/30" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {t('trustBadge')}
              </p>
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="h-3.5 w-3.5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
