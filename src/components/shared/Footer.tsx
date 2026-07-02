import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Phone, Mail, MessageSquare } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-dark text-text-on-dark">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand column */}
          <div>
            <h3 className="text-lg font-bold text-text-on-dark">
              {t('brandName')}
            </h3>
            <p className="mt-1 text-sm text-text-on-dark-muted">
              {t('qualification1')}
            </p>
            <p className="text-sm text-text-on-dark-muted">
              {t('qualification2')}
            </p>
          </div>

          {/* Quick Links column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-on-dark-muted">
              {t('quickLinks')}
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-sm text-text-on-dark-muted transition-colors hover:text-text-on-dark"
                >
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/services`}
                  className="text-sm text-text-on-dark-muted transition-colors hover:text-text-on-dark"
                >
                  {tNav('services')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/book`}
                  className="text-sm text-text-on-dark-muted transition-colors hover:text-text-on-dark"
                >
                  {tNav('book')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-sm text-text-on-dark-muted transition-colors hover:text-text-on-dark"
                >
                  {t('privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-on-dark-muted">
              {t('contactUs')}
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={`tel:${t('phone').replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 text-sm text-text-on-dark-muted transition-colors hover:text-text-on-dark"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {t('phone')}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${t('email')}`}
                  className="inline-flex items-center gap-2 text-sm text-text-on-dark-muted transition-colors hover:text-text-on-dark"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {t('email')}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${t('phone').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-text-on-dark-muted transition-colors hover:text-text-on-dark"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {t('whatsapp')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-text-on-dark-muted">
            {t('copyright', { year: currentYear.toString() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
