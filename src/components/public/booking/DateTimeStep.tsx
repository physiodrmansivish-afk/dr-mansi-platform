import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useBooking } from './BookingContext';
import { DayPicker } from 'react-day-picker';
import { format, isBefore, startOfToday, isSunday } from 'date-fns';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import 'react-day-picker/style.css'; // basic styling for day picker

export default function DateTimeStep() {
  const t = useTranslations('booking');
  const { form, nextStep, prevStep } = useBooking();
  const selectedDate = form.watch('date');
  const selectedTime = form.watch('time');
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      const fetchSlots = async () => {
        setIsLoading(true);
        setAvailableSlots([]);
        form.setValue('time', '');
        
        try {
          const formattedDate = format(selectedDate, 'yyyy-MM-dd');
          const res = await axios.get(`/api/appointments/available-slots?date=${formattedDate}`);
          if (res.data && res.data.slots) {
            setAvailableSlots(res.data.slots);
          } else {
            // Mock slots if API is not fully implemented yet
            setAvailableSlots(['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:00 PM']);
          }
        } catch (error) {
          console.error('Error fetching slots:', error);
          // Fallback mock slots for dev before API is ready
          setAvailableSlots(['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:00 PM']);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSlots();
    }
  }, [selectedDate, form]);

  const disabledDays = (date: Date) => {
    return isBefore(date, startOfToday()) || isSunday(date);
  };

  const onSubmit = () => {
    nextStep();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8 rounded-xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-text">{t('steps.step2')}</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Calendar Section */}
          <div>
            <div className="flex justify-center">
              <div className="rdp-container">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      form.setValue('date', date, { shouldValidate: true });
                    }
                  }}
                  disabled={disabledDays}
                  showOutsideDays
                  className="mx-auto"
                />
              </div>
            </div>
            {form.formState.errors.date && (
              <p className="mt-2 text-center text-sm text-red-500">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>

          {/* Time Slots Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-text">
              {t('selectDateFirst')}
            </h3>
            
            {!selectedDate ? (
              <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-surface-secondary">
                <p className="text-text-muted">{t('selectDateFirst')}</p>
              </div>
            ) : isLoading ? (
              <div className="flex h-48 items-center justify-center rounded-lg border border-border">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="flex h-48 items-center justify-center rounded-lg border border-border">
                <p className="text-text-muted">{t('noSlots')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                {availableSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => form.setValue('time', time, { shouldValidate: true })}
                    className={`rounded-full border py-2.5 text-sm font-medium transition-colors ${
                      selectedTime === time
                        ? 'border-primary bg-primary text-white'
                        : 'border-primary text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
            
            {form.formState.errors.time && (
              <p className="mt-4 text-sm text-red-500">
                {form.formState.errors.time.message}
              </p>
            )}
          </div>
        </div>

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
