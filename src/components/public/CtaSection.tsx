'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export default function CtaSection() {
  const t = useTranslations('home.cta');
  const locale = useLocale();

  return (
    <section className="bg-primary py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-text-on-dark sm:text-3xl lg:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/80 sm:text-lg">
            {t('subtitle')}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href={`/${locale}/book`}
              className="inline-flex w-full items-center justify-center rounded-btn bg-white px-8 py-3.5 text-base font-semibold text-primary shadow-sm transition-all hover:bg-gray-50 hover:shadow-md sm:w-auto"
            >
              {t('button')}
            </Link>
            <a
              href="https://wa.me/918318228028"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-btn border-2 border-white/30 bg-transparent px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10 sm:w-auto"
            >
              <MessageSquare className="h-4 w-4" />
              {t('whatsapp')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
