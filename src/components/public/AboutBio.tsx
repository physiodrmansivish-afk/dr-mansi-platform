import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';

export default function AboutBio() {
  const t = useTranslations('about');

  const qualifications = [
    t('qualBpt'),
    t('qualMpt'),
    t('qualConsultant'),
  ];

  return (
    <section className="bg-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-5">
          {/* Left: Photo + qualification badges */}
          <div className="flex flex-col items-center lg:col-span-2">
            {/* Photo with circular clip and verified badge */}
            <div className="relative">
              <div className="h-56 w-56 overflow-hidden rounded-full border-4 border-primary-light sm:h-64 sm:w-64">
                <Image
                  src="/images/dr-mansi.png"
                  alt="Dr. Mansi Vishwakarma"
                  width={256}
                  height={256}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              {/* Verified badge */}
              <span className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md">
                <BadgeCheck className="h-5 w-5" />
              </span>
            </div>

            {/* Qualification badges */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {qualifications.map((qual) => (
                <span
                  key={qual}
                  className="rounded-badge border border-primary/20 bg-primary-lightest px-4 py-1.5 text-xs font-medium text-primary"
                >
                  {qual}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Bio text */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              {t('sectionTitle')}
            </h2>
            <div className="mt-2 h-0.5 w-12 bg-primary" />

            <p className="mt-6 text-sm leading-relaxed text-text-secondary sm:text-base">
              {t('bio1')}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
              {t('bio2')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
