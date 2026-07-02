import { createAdminClient } from '@/lib/supabase/server';
import InvoicesModule from '@/components/dashboard/invoices/InvoicesModule';
import { InvoiceData } from '@/components/dashboard/invoices/InvoicesTable';

export default async function InvoicesPage() {
  const supabase = await createAdminClient();

  // Fetch invoices with patient names
  const { data: invoicesRaw, error } = await supabase
    .from('invoices')
    .select(`
      *,
      patients (
        full_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch invoices:', error);
  }

  // Map the join data to a flat structure for the component
  const processedInvoices: InvoiceData[] = (invoicesRaw || []).map((inv: any) => ({
    id: inv.id,
    invoice_number: inv.invoice_number,
    patient_id: inv.patient_id,
    appointment_id: inv.appointment_id,
    line_items: inv.line_items,
    subtotal: inv.subtotal,
    discount: inv.discount,
    total: inv.total,
    status: inv.status,
    issue_date: inv.issue_date,
    due_date: inv.due_date,
    notes: inv.notes,
    patient_name: inv.patients?.full_name || 'Unknown Patient',
  }));

  return (
    <InvoicesModule initialInvoices={processedInvoices} />
  );
}
