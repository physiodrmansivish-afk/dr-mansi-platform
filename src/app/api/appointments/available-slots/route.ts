import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { getAppointmentsByDate, getBlockedSlotsByDate } from '@/lib/supabase/queries';
import { parse, format, addMinutes, isBefore, isSameDay } from 'date-fns';

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

const WORKING_HOURS_START = '09:00';
const WORKING_HOURS_END = '17:00';
const INTERVAL_MINUTES = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    // 1. Validate date
    const validationResult = querySchema.safeParse({ date: dateParam });
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.format() }, { status: 400 });
    }
    const { date } = validationResult.data;

    const supabase = await createAdminClient();

    // 2. Fetch Booked Appointments & Blocked Slots in parallel
    const [appointments, blockedSlots] = await Promise.all([
      getAppointmentsByDate(supabase, date),
      getBlockedSlotsByDate(supabase, date),
    ]);

    // 3. Generate all possible slots for the day
    const allSlots: string[] = [];
    const baseDate = parse(date, 'yyyy-MM-dd', new Date());
    let currentSlot = parse(WORKING_HOURS_START, 'HH:mm', baseDate);
    const endSlot = parse(WORKING_HOURS_END, 'HH:mm', baseDate);

    while (!isBefore(endSlot, currentSlot)) {
      // Use 12-hour format for frontend compatibility (e.g. "09:00 AM")
      allSlots.push(format(currentSlot, 'hh:mm a'));
      currentSlot = addMinutes(currentSlot, INTERVAL_MINUTES);
    }

    // 4. Filter out booked and blocked slots
    const unavailableSlots = new Set<string>();

    appointments.forEach((appt) => {
      if (appt.status !== 'cancelled' && appt.status !== 'rescheduled') {
        const timeObj = parse(appt.start_time, 'HH:mm:ss', baseDate);
        unavailableSlots.add(format(timeObj, 'hh:mm a'));
      }
    });

    blockedSlots.forEach((blocked) => {
      const timeObj = parse(blocked.start_time, 'HH:mm:ss', baseDate);
      unavailableSlots.add(format(timeObj, 'hh:mm a'));
    });

    // Handle past times if the date is today
    const now = new Date();
    if (isSameDay(baseDate, now)) {
      allSlots.forEach((slot) => {
        const slotTime = parse(slot, 'hh:mm a', baseDate);
        if (isBefore(slotTime, now)) {
          unavailableSlots.add(slot);
        }
      });
    }

    const availableSlots = allSlots.filter((slot) => !unavailableSlots.has(slot));

    return NextResponse.json({ slots: availableSlots });
  } catch (error: any) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
