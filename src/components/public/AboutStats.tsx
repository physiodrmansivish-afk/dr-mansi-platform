import { useTranslations } from 'next-intl';

export default function AboutStats() {
  const t = useTranslations('about');

  const stats = [
    { value: t('statPatients'), label: t('statPatientsLabel') },
    { value: t('statExperience'), label: t('statExperienceLabel') },
    { value: t('statHomeVisit'), label: t('statHomeVisitLabel') },
  ];

  return (
    <section className="bg-surface pb-16 sm:pb-20 lg:pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-card border border-border p-6 text-center"
            >
              <span className="text-2xl font-bold text-primary sm:text-3xl">
                {stat.value}
              </span>
              <span className="mt-1 text-xs font-medium text-text-muted sm:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
