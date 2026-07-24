'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

export default function HeroSection() {
  const t = useTranslations('home.hero');
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-surface-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Professional Photo — shows first on mobile for trust */}
          <motion.div 
            className="order-1 lg:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Main photo */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl w-[280px] h-[350px] sm:w-[340px] sm:h-[420px] lg:w-[400px] lg:h-[500px]">
                <img
                  src="/media/images/work-2.jpeg"
                  alt="Dr. Mansi Vishwakarma - Consultant Physiotherapist"
                  className="h-full w-full object-cover"
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm font-semibold text-white">Dr. Mansi Vishwakarma</p>
                  <p className="text-xs text-white/80">{t('badge')}</p>
                </div>
              </div>
              {/* Decorative accent */}
              <div className="absolute -top-3 -right-3 h-full w-full rounded-2xl border-2 border-primary/20 -z-10" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl -z-10" />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            className="order-2 lg:order-1 max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Headline */}
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl xl:text-6xl">
              {t('titleLine1')}
              <br />
              <span className="text-primary">{t('titleLine2')}</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-lg font-medium text-text-secondary sm:text-xl lg:text-2xl">
              {t('subtitle')}
            </p>

            {/* Description */}
            <p className="mt-3 max-w-md text-base leading-relaxed text-text-muted">
              {t('description')}
            </p>

            {/* Trust indicator */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-base font-semibold text-text-primary">
                {t('trustBadge')}
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href={`/${locale}/book`}
                className="inline-flex items-center justify-center rounded-btn bg-primary px-7 py-3.5 text-base font-semibold text-text-on-dark shadow-sm transition-all hover:bg-primary-hover hover:shadow-md focus-visible:outline-primary"
              >
                {t('ctaPrimary')}
              </Link>
              <a
                href="https://wa.me/918318228028"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-btn border-2 border-primary bg-white px-7 py-3.5 text-base font-semibold text-primary transition-all hover:bg-primary-light hover:shadow-md"
              >
                <Phone className="h-4 w-4" />
                {t('ctaSecondary')}
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
