import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useTranslations as useFooterTranslations } from 'next-intl';

export default function ServicesCta() {
  const t = useTranslations('services');
  const tFooter = useFooterTranslations('footer');
  const locale = useLocale();
  
  // Clean phone number for WhatsApp link
  const phoneRaw = tFooter('phone').replace(/[^0-9]/g, '');

  return (
    <section className="bg-surface px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[24px] bg-surface-dark px-6 py-16 text-center shadow-lg sm:px-12 sm:py-20">
        <h2 className="text-2xl font-bold text-text-on-dark sm:text-3xl lg:text-4xl">
          {t('ctaTitle')}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-on-dark-muted sm:text-base">
          {t('ctaSubtitle')}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link
            href={`/${locale}/book`}
            className="flex w-full items-center justify-center rounded-btn bg-surface px-8 py-3 text-sm font-semibold text-surface-dark transition-colors hover:bg-surface-secondary sm:w-auto"
          >
            {t('scheduleAppt')}
          </Link>
          <a
            href={`https://wa.me/${phoneRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-btn border border-white/20 bg-transparent px-8 py-3 text-sm font-semibold text-text-on-dark transition-colors hover:bg-white/10 sm:w-auto"
          >
            {t('contactWhatsapp')}
          </a>
        </div>
      </div>
    </section>
  );
}
