import { useTranslations } from 'next-intl';
import { Home, ShieldCheck, CalendarDays, ClipboardList } from 'lucide-react';

const features = [
  { key: 'homeVisits', Icon: Home },
  { key: 'certified', Icon: ShieldCheck },
  { key: 'flexible', Icon: CalendarDays },
  { key: 'personalized', Icon: ClipboardList },
] as const;

export default function WhyChooseUsSection() {
  const t = useTranslations('home.whyChoose');

  return (
    <section className="bg-surface-secondary py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
            {t('title')}
          </h2>
          <div className="mx-auto mt-2 h-0.5 w-12 bg-primary" />
        </div>

        {/* Features grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ key, Icon }) => (
            <div key={key} className="text-center sm:text-left">
              {/* Icon */}
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Icon className="h-6 w-6" />
              </div>

              {/* Title */}
              <h3 className="mb-1 text-base font-semibold text-text-primary">
                {t(`items.${key}.title`)}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-text-muted">
                {t(`items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
