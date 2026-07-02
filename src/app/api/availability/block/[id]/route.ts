import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const { error } = await supabase
      .from('blocked_slots')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('DB Error unblocking slot:', error);
      return NextResponse.json({ error: 'Failed to unblock slot' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in availability unblock API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
