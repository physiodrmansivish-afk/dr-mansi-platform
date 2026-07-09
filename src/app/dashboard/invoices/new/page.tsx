import CreateInvoiceForm from '@/components/dashboard/invoices/CreateInvoiceForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewInvoicePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link 
          href="/dashboard/invoices"
          className="inline-flex items-center text-sm font-medium text-text-muted hover:text-[#006064]"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Invoices
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#006064]">Create New Invoice</h1>
        <p className="text-sm text-text-muted mt-1">Draft a new invoice and assign it to a patient.</p>
      </div>

      <CreateInvoiceForm patients={[]} />
    </div>
  );
}
