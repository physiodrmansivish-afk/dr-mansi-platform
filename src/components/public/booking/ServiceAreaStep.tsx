import { useTranslations } from 'next-intl';
import { useBooking } from './BookingContext';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const serviceKeys = ['ortho', 'postSurgery', 'sports', 'neuro', 'elderly', 'chronic'];
const areaKeys = [
  'dharampeth',
  'sitabuldi',
  'ramdaspeth',
  'civilLines',
  'bajajNagar',
  'pratapNagar',
  'manishNagar',
  'shankarNagar',
  'hingna',
  'wardhaRoad',
  'katolRoad',
  'amravatiRoad',
];

export default function ServiceAreaStep() {
  const t = useTranslations();
  const tb = useTranslations('booking');
  const { form, nextStep } = useBooking();
  const searchParams = useSearchParams();

  useEffect(() => {
    const serviceQuery = searchParams.get('service');
    if (serviceQuery && serviceKeys.includes(serviceQuery)) {
      form.setValue('service', serviceQuery);
    }
  }, [searchParams, form]);

  const onSubmit = () => {
    nextStep();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-8 rounded-xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-text">{tb('steps.step1')}</h2>
        
        <form className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-text">
              {tb('form.service')}
            </label>
            <select
              {...form.register('service')}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="" disabled>
                {tb('form.service')}
              </option>
              {serviceKeys.map((key) => (
                <option key={key} value={key}>
                  {t(`services.items.${key}.title`)}
                </option>
              ))}
            </select>
            {form.formState.errors.service && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.service.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text">
              {tb('form.area')}
            </label>
            <select
              {...form.register('area')}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="" disabled>
                {tb('form.area')}
              </option>
              {areaKeys.map((key) => (
                <option key={key} value={key}>
                  {t(`areas.localities.${key}`)}
                </option>
              ))}
            </select>
            {form.formState.errors.area && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.area.message}
              </p>
            )}
          </div>
        </form>

        <div className="mt-10 border-t border-border pt-6">
          <button
            type="button"
            onClick={onSubmit}
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-primary-hover sm:w-auto sm:min-w-[200px]"
          >
            {tb('actions.next')}
          </button>
        </div>
      </div>
    </div>
  );
}
