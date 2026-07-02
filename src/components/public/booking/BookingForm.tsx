'use client';

import { useBooking } from './BookingContext';
import StepIndicator from './StepIndicator';
import ServiceAreaStep from './ServiceAreaStep';
import DateTimeStep from './DateTimeStep';
import PatientDetailsStep from './PatientDetailsStep';
import ConfirmationStep from './ConfirmationStep';

export default function BookingForm() {
  const { currentStep } = useBooking();

  return (
    <div className="w-full">
      <StepIndicator />
      
      <div className="mt-8">
        {currentStep === 1 && <ServiceAreaStep />}
        {currentStep === 2 && <DateTimeStep />}
        {currentStep === 3 && <PatientDetailsStep />}
        {currentStep === 4 && <ConfirmationStep />}
      </div>
    </div>
  );
}
