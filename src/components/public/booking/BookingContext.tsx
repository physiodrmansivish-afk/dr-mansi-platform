'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

// Define the schema for the booking form
export const getBookingSchema = (t: any) =>
  z.object({
    service: z.string().min(1, t('validation.serviceRequired')),
    area: z.string().min(1, t('validation.areaRequired')),
    date: z.date({
      message: t('validation.dateRequired'),
    }),
    time: z.string().min(1, t('validation.timeRequired')),
    fullName: z.string().min(1, t('validation.nameRequired')),
    phone: z
      .string()
      .min(10, t('validation.phoneInvalid'))
      .max(10, t('validation.phoneInvalid'))
      .regex(/^[0-9]+$/, t('validation.phoneInvalid')),
    address: z.string().min(1, t('validation.addressRequired')),
    notes: z.string().optional(),
  });

export type BookingFormData = z.infer<ReturnType<typeof getBookingSchema>>;

interface BookingContextType {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  form: UseFormReturn<BookingFormData>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const t = useTranslations('booking');
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(getBookingSchema(t)),
    mode: 'onTouched',
    defaultValues: {
      service: '',
      area: '',
      fullName: '',
      phone: '',
      address: '',
      notes: '',
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof BookingFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['service', 'area'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['date', 'time'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['fullName', 'phone', 'address'];
    }

    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <BookingContext.Provider value={{ currentStep, nextStep, prevStep, form }}>
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
