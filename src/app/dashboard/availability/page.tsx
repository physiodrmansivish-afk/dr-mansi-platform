import { createAdminClient } from '@/lib/supabase/server';
import AvailabilityModule from '@/components/dashboard/availability/AvailabilityModule';
import { format } from 'date-fns';

export default async function AvailabilityPage() {
  const supabase = await createAdminClient();
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Fetch upcoming blocked slots (date >= today)
  const { data: blockedSlots, error } = await supabase
    .from('blocked_slots')
    .select('*')
    .gte('slot_date', todayStr)
    .order('slot_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Failed to fetch blocked slots:', error);
  }

  return (
    <AvailabilityModule initialBlockedSlots={blockedSlots || []} />
  );
}
