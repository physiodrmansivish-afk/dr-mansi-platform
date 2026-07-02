import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';

const blockSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time format"),
  endTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time format"),
  reason: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = blockSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
    }

    const { date, startTime, endTime, reason } = result.data;
    
    // Normalize time to HH:mm:ss if it's HH:mm
    const normStartTime = startTime.length === 5 ? `${startTime}:00` : startTime;
    const normEndTime = endTime.length === 5 ? `${endTime}:00` : endTime;

    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('blocked_slots')
      .insert({
        slot_date: date,
        start_time: normStartTime,
        end_time: normEndTime,
        reason: reason || null
      })
      .select()
      .single();

    if (error) {
      console.error('DB Error blocking slot:', error);
      return NextResponse.json({ error: 'Failed to block slot' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in availability block API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
