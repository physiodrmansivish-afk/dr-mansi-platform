import { getTranslations } from 'next-intl/server';
import { Phone, Mail, Award, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('contactTitle'),
    description: t('contactDescription'),
    openGraph: {
      title: t('contactTitle'),
      description: t('contactDescription'),
    },
  };
}

export default async function ContactPage(props: ContactPageProps) {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });
  const tCommon = await getTranslations({ locale: params.locale, namespace: 'common' });

  return (
    <main className="min-h-screen bg-surface pt-24 pb-16">
      {/* Hero Section */}
      <div className="bg-primary/5 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          
          {/* Contact Details Card */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <h2 className="mb-8 text-2xl font-bold text-text-primary">Get in Touch</h2>
            
            <div className="space-y-8">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-lightest text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{t('phone')}</h3>
                  <a href="tel:+918318228028" className="mt-1 block text-lg text-primary hover:underline">
                    +91 83182 28028
                  </a>
                  <p className="mt-1 text-sm text-text-muted">Available for Homecare</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-lightest text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{t('email')}</h3>
                  <a href="mailto:mansi.vishwakarma8@gmail.com" className="mt-1 block text-text-secondary hover:text-primary">
                    mansi.vishwakarma8@gmail.com
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-lightest text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{t('hours')}</h3>
                  <p className="mt-1 text-text-secondary">{tCommon('workingHours')}</p>
                </div>
              </div>

              {/* Qualifications & Registration */}
              <div className="flex items-start gap-4 pt-4 border-t border-border">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-lightest text-primary">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Dr. Mansi Vishwakarma</h3>
                  <p className="text-text-secondary">BPT, MPT (Ortho) | Consultant Physiotherapist</p>
                  <div className="mt-2 space-y-1 text-sm text-text-muted">
                    <p>Registration: IAP - L- 51688</p>
                    <p>UPSMF- BPT/4717</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Action / CTA */}
          <div className="flex flex-col justify-center rounded-2xl bg-primary p-8 text-white sm:p-12">
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to start your recovery?</h2>
            <p className="mt-4 text-white/80">
              We bring clinical-grade physiotherapy directly to your doorstep. Schedule a consultation today and take the first step towards a pain-free life.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-300" />
                <span className="text-base">Expert Care at Home</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-300" />
                <span className="text-base">Personalized Treatment Plans</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-300" />
                <span className="text-base">Flexible Scheduling</span>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href={`/${params.locale}/book`}
                className="inline-flex justify-center rounded-btn bg-white px-8 py-3.5 text-base font-semibold text-primary transition-colors hover:bg-gray-100"
              >
                Book Appointment
              </Link>
              <a
                href="https://wa.me/918318228028"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center rounded-btn border-2 border-white px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
