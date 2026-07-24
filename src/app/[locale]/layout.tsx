import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

import { getTranslations } from 'next-intl/server';
import { Analytics } from "@vercel/analytics/next";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.physiomansi.com';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: t('defaultTitle'),
      template: t('titleTemplate'),
    },
    description: t('description'),
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_IN' : 'mr_IN',
      url: baseUrl,
      siteName: t('siteName'),
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        mr: `${baseUrl}/mr`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.physiomansi.com';

  // JSON-LD structured data for the clinic (local SEO)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: 'Dr. Mansi Vishwakarma',
    jobTitle: 'Consultant Physiotherapist',
    medicalSpecialty: 'Orthopedic Physiotherapy',
    description: 'Expert physiotherapy care at your doorstep across Mumbai, Thane, and Diva. Personalized orthopedic rehabilitation, post-surgery recovery, and pain management by Dr. Mansi Vishwakarma (BPT, MPT Ortho).',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Arjun Residency, D Wing 502, Sabegaon Road',
      addressLocality: 'Diva East',
      addressRegion: 'Maharashtra',
      postalCode: '400612',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.2183,
      longitude: 73.0455,
    },
    telephone: '+918318228028',
    url: baseUrl,
    priceRange: '₹₹',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
    areaServed: [
      { '@type': 'City', name: 'Mumbai' },
      { '@type': 'City', name: 'Thane' },
      { '@type': 'City', name: 'Dombivli' },
      { '@type': 'City', name: 'Kalyan' },
      { '@type': 'City', name: 'Diva' },
    ],
    sameAs: [],
  };

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
