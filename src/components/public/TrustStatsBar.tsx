import { useTranslations } from 'next-intl';
import { Calendar, Users, Award, Home } from 'lucide-react';

const stats = [
  { key: 'years', valueKey: 'years', labelKey: 'yearsLabel', Icon: Calendar },
  { key: 'patients', valueKey: 'patients', labelKey: 'patientsLabel', Icon: Users },
  { key: 'specialist', valueKey: 'specialist', labelKey: 'specialistLabel', Icon: Award },
  { key: 'homeVisits', valueKey: 'homeVisits', labelKey: 'homeVisitsLabel', Icon: Home },
] as const;

export default function TrustStatsBar() {
  const t = useTranslations('home.trustStats');

  return (
    <section className="bg-surface-dark py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {stats.map(({ key, valueKey, labelKey, Icon }) => (
            <div key={key} className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Icon className="h-6 w-6 text-primary-light" />
              </div>
              <div>
                <p className="text-xl font-bold text-text-on-dark sm:text-2xl">
                  {t(valueKey)}
                </p>
                <p className="text-xs text-text-on-dark-muted sm:text-sm">
                  {t(labelKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
