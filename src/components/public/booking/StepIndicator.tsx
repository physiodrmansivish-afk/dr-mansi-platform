import { useTranslations } from 'next-intl';
import { useBooking } from './BookingContext';
import { Check } from 'lucide-react';
import clsx from 'clsx';

export default function StepIndicator() {
  const t = useTranslations('booking.steps');
  const { currentStep } = useBooking();

  const steps = [
    { number: 1, label: t('step1') },
    { number: 2, label: t('step2') },
    { number: 3, label: t('step3') },
    { number: 4, label: t('step4') },
  ];

  return (
    <div className="mb-8 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-6 sm:px-6">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div key={step.number} className="flex flex-1 items-center">
              <div className="relative flex flex-col items-center sm:flex-row sm:gap-3">
                <div
                  className={clsx(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors',
                    {
                      'bg-primary text-white': isActive || isCompleted,
                      'bg-surface-secondary text-text-muted': !isActive && !isCompleted,
                    }
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.number}
                </div>
                <span
                  className={clsx(
                    'absolute -bottom-6 whitespace-nowrap text-xs font-medium sm:static sm:whitespace-normal sm:text-sm',
                    {
                      'text-primary': isActive || isCompleted,
                      'text-text-muted': !isActive && !isCompleted,
                      'hidden sm:block': true, // Hide label on very small screens if it overlaps, but design shows them.
                      // Adjusting to always show on mobile might cause overlap if 4 steps. Let's keep it visible.
                    }
                  )}
                  style={{ display: 'block' }} // override the hidden for now to see how it fits
                >
                  {step.label}
                </span>
              </div>
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="mx-2 h-0.5 w-full flex-1 bg-border sm:mx-4">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
