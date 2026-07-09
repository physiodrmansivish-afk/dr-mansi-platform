'use client';

import { useBooking, InquiryFormData } from './BookingContext';
import BookingSuccess from './BookingSuccess';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Loader2, Send, User, Phone, MapPin, Stethoscope, FileText } from 'lucide-react';
import axios from 'axios';

const serviceKeys = ['ortho', 'postSurgery', 'sports', 'neuro', 'elderly', 'chronic'];
const areaKeys = [
  'dharampeth', 'sitabuldi', 'ramdaspeth', 'civilLines',
  'bajajNagar', 'pratapNagar', 'manishNagar', 'shankarNagar',
  'hingna', 'wardhaRoad', 'katolRoad', 'amravatiRoad',
];

export default function BookingForm() {
  const t = useTranslations();
  const tb = useTranslations('booking');
  const { form, isSubmitted, setIsSubmitted } = useBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, formState: { errors } } = form;

  if (isSubmitted) {
    return <BookingSuccess />;
  }

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        fullName: data.fullName,
        age: data.age,
        sex: data.sex,
        phone: data.phone,
        area: data.area,
        service: data.service,
        address: data.address,
        notes: data.notes || '',
      };

      const response = await axios.post('/api/inquiries', payload);

      if (response.data.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(response.data.error || 'Something went wrong. Please try again.');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setSubmitError(err.response.data.error);
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Page Title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-text sm:text-4xl">{tb('title')}</h1>
        <p className="mt-3 text-base text-text-muted">{tb('subtitle')}</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8"
      >
        {/* Full Name */}
        <div className="mb-5">
          <label htmlFor="fullName" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-text">
            <User className="h-4 w-4 text-primary" />
            {tb('form.fullName')} <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            placeholder={tb('form.fullName')}
            {...register('fullName')}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        {/* Age & Sex — side by side */}
        <div className="mb-5 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="mb-1.5 block text-sm font-medium text-text">
              {tb('form.age')} <span className="text-red-500">*</span>
            </label>
            <input
              id="age"
              type="number"
              min={1}
              max={120}
              placeholder={tb('form.age')}
              {...register('age', { valueAsNumber: true })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="sex" className="mb-1.5 block text-sm font-medium text-text">
              {tb('form.sex')} <span className="text-red-500">*</span>
            </label>
            <select
              id="sex"
              {...register('sex')}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="" disabled>{tb('form.sex')}</option>
              <option value="male">{tb('form.sexOptions.male')}</option>
              <option value="female">{tb('form.sexOptions.female')}</option>
              <option value="other">{tb('form.sexOptions.other')}</option>
            </select>
            {errors.sex && (
              <p className="mt-1 text-sm text-red-500">{errors.sex.message}</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="mb-5">
          <label htmlFor="phone" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-text">
            <Phone className="h-4 w-4 text-primary" />
            {tb('form.phone')} <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border bg-surface-secondary px-3 text-sm text-text-muted">
              +91
            </span>
            <input
              id="phone"
              type="tel"
              maxLength={10}
              placeholder="98765 43210"
              {...register('phone')}
              className="w-full rounded-r-lg border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Service */}
        <div className="mb-5">
          <label htmlFor="service" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-text">
            <Stethoscope className="h-4 w-4 text-primary" />
            {tb('form.service')} <span className="text-red-500">*</span>
          </label>
          <select
            id="service"
            {...register('service')}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="" disabled>{tb('form.service')}</option>
            {serviceKeys.map((key) => (
              <option key={key} value={key}>
                {t(`services.items.${key}.title`)}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="mt-1 text-sm text-red-500">{errors.service.message}</p>
          )}
        </div>

        {/* Area */}
        <div className="mb-5">
          <label htmlFor="area" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-text">
            <MapPin className="h-4 w-4 text-primary" />
            {tb('form.area')} <span className="text-red-500">*</span>
          </label>
          <select
            id="area"
            {...register('area')}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="" disabled>{tb('form.area')}</option>
            {areaKeys.map((key) => (
              <option key={key} value={key}>
                {t(`areas.localities.${key}`)}
              </option>
            ))}
          </select>
          {errors.area && (
            <p className="mt-1 text-sm text-red-500">{errors.area.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="mb-5">
          <label htmlFor="address" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-text">
            <MapPin className="h-4 w-4 text-primary" />
            {tb('form.address')} <span className="text-red-500">*</span>
          </label>
          <input
            id="address"
            type="text"
            placeholder={tb('form.address')}
            {...register('address')}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label htmlFor="notes" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-text">
            <FileText className="h-4 w-4 text-primary" />
            {tb('form.notes')}
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder={tb('form.notes')}
            {...register('notes')}
            className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Error message */}
        {submitError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {tb('form.submitting')}
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              {tb('form.submit')}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
