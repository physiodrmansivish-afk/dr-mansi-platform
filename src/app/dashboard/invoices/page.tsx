import InvoicesModule from '@/components/dashboard/invoices/InvoicesModule';
import { InvoiceData } from '@/components/dashboard/invoices/InvoicesTable';

export default function InvoicesPage() {
  const processedInvoices: InvoiceData[] = [];

  return (
    <InvoicesModule initialInvoices={processedInvoices} />
  );
}
