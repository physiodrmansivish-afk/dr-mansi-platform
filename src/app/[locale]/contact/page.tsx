import { getTranslations } from 'next-intl/server';
import { Phone, Mail, Award, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import MediaBubble from '@/components/shared/MediaBubble';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage(props: ContactPageProps) {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });
  const tCommon = await getTranslations({ locale: params.locale, namespace: 'common' });

  return (
    <main className="relative min-h-screen bg-surface pt-24 pb-16 overflow-hidden">
      {/* Background Bubbles (scattered) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden z-20">
        <div className="pointer-events-auto">
          <MediaBubble 
            src="/media/images/work-7.jpeg" 
            type="image" 
            size={150} 
            className="absolute top-48 left-10 opacity-70 hover:opacity-100"
            delay={0.2}
            yOffset={12}
          />
          <MediaBubble 
            src="/media/images/work-8.jpeg" 
            type="image" 
            size={180} 
            className="absolute bottom-8 left-10 opacity-70 hover:opacity-100"
            delay={1.5}
            yOffset={18}
          />
          <MediaBubble 
            src="/media/videos/video-3.mp4" 
            type="video" 
            size={160} 
            className="absolute top-80 right-10 opacity-70 hover:opacity-100"
            delay={0.8}
            yOffset={22}
          />
        </div>
      </div>

      <div className="relative z-10">
      {/* Hero Section */}
      <div className="bg-primary/5 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
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
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h2 className="mb-8 text-2xl font-bold text-text">Get in Touch</h2>
            
            <div className="space-y-8">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-lightest text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">{t('phone')}</h3>
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
                  <h3 className="font-semibold text-text">{t('email')}</h3>
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
                  <h3 className="font-semibold text-text">{t('hours')}</h3>
                  <p className="mt-1 text-text-secondary">{tCommon('workingHours')}</p>
                </div>
              </div>

              {/* Qualifications & Registration */}
              <div className="flex items-start gap-4 pt-4 border-t border-border">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-lightest text-primary">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">Dr. Mansi Vishwakarma</h3>
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
            <h2 className="text-3xl font-bold">Ready to start your recovery?</h2>
            <p className="mt-4 text-primary-lightest">
              We bring clinical-grade physiotherapy directly to your doorstep. Schedule a consultation today and take the first step towards a pain-free life.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-300" />
                <span>Expert Care at Home</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-300" />
                <span>Personalized Treatment Plans</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-300" />
                <span>Flexible Scheduling</span>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href={`/${params.locale}/book`}
                className="inline-flex justify-center rounded-lg bg-white px-8 py-3 font-semibold text-primary transition-colors hover:bg-gray-100"
              >
                Book Appointment
              </Link>
              <a
                href="https://wa.me/918318228028"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>
      </div>
    </main>
  );
}
