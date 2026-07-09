'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

// Schema for the simplified inquiry form
export const getInquirySchema = (t: (key: string) => string) =>
  z.object({
    service: z.string().min(1, t('validation.serviceRequired')),
    area: z.string().min(1, t('validation.areaRequired')),
    fullName: z.string().min(1, t('validation.nameRequired')),
    age: z
      .number({ message: t('validation.ageRequired') })
      .int(t('validation.ageInvalid'))
      .min(1, t('validation.ageInvalid'))
      .max(120, t('validation.ageInvalid')),
    sex: z.string().min(1, t('validation.sexRequired')),
    phone: z
      .string()
      .min(10, t('validation.phoneInvalid'))
      .max(10, t('validation.phoneInvalid'))
      .regex(/^[0-9]+$/, t('validation.phoneInvalid')),
    address: z.string().min(1, t('validation.addressRequired')),
    notes: z.string().optional(),
  });

export type InquiryFormData = z.infer<ReturnType<typeof getInquirySchema>>;

interface BookingContextType {
  form: UseFormReturn<InquiryFormData>;
  isSubmitted: boolean;
  setIsSubmitted: (val: boolean) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const t = useTranslations('booking');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(getInquirySchema(t)),
    mode: 'onTouched',
    defaultValues: {
      service: '',
      area: '',
      fullName: '',
      age: undefined,
      sex: '',
      phone: '',
      address: '',
      notes: '',
    },
  });

  return (
    <BookingContext.Provider value={{ form, isSubmitted, setIsSubmitted }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
