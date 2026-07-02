import { useTranslations } from 'next-intl';
import { useBooking } from './BookingContext';

export default function PatientDetailsStep() {
  const t = useTranslations('booking');
  const { form, nextStep, prevStep } = useBooking();

  const onSubmit = () => {
    nextStep();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-8 rounded-xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-text">{t('steps.step3')}</h2>
        
        <form className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-text">
              {t('form.fullName')}
            </label>
            <input
              type="text"
              {...form.register('fullName')}
              placeholder="Enter your full legal name"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {form.formState.errors.fullName && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text">
              {t('form.phone')}
            </label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border bg-surface-secondary px-4 text-text-muted">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                {...form.register('phone')}
                placeholder="98765 43210"
                className="w-full rounded-r-lg border border-border bg-surface px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            {form.formState.errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text">
              {t('form.address')}
            </label>
            <textarea
              {...form.register('address')}
              rows={3}
              placeholder="Flat/House No, Building, Street details..."
              className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {form.formState.errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text">
              {t('form.notes')}
            </label>
            <textarea
              {...form.register('notes')}
              rows={2}
              placeholder="Any specific condition or instructions..."
              className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </form>

        <div className="mt-10 flex flex-col-reverse justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:gap-0">
          <button
            type="button"
            onClick={prevStep}
            className="w-full rounded-lg border border-border bg-transparent px-4 py-3 font-semibold text-text transition-colors hover:bg-surface-secondary sm:w-auto sm:min-w-[120px]"
          >
            {t('actions.back')}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-primary-hover sm:w-auto sm:min-w-[200px]"
          >
            {t('actions.next')}
          </button>
        </div>
      </div>
    </div>
  );
}
