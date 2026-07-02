'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, Calendar, FileText, Loader2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createInvoice } from '@/app/dashboard/invoices/actions';
import { format } from 'date-fns';

interface PatientOption {
  id: string;
  full_name: string;
  phone: string;
}

interface AppointmentOption {
  id: string;
  appointment_date: string;
  start_time: string;
  area: string;
}

interface CreateInvoiceFormProps {
  patients: PatientOption[];
  // If we pre-load unbilled appointments for a selected patient, we could pass them.
  // For simplicity, we just allow selecting a patient first.
}

export default function CreateInvoiceForm({ patients }: CreateInvoiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [patientId, setPatientId] = useState('');
  const [issueDate, setIssueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('unpaid');
  
  const [lineItems, setLineItems] = useState([{ id: Date.now().toString(), description: '', amount: 0 }]);
  const [discount, setDiscount] = useState(0);

  const addLineItem = () => {
    setLineItems([...lineItems, { id: Date.now().toString(), description: '', amount: 0 }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: 'description' | 'amount', value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Calculations
  const subtotal = useMemo(() => {
    return lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [lineItems]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      setError('Please select a patient.');
      return;
    }
    
    // Validate line items
    const validItems = lineItems.filter(item => item.description.trim() !== '' && item.amount > 0);
    if (validItems.length === 0) {
      setError('Please add at least one valid line item with an amount > 0.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const data = {
      patientId,
      appointmentId: null, // Hardcoded null for now unless we add appointment selector
      lineItems: validItems.map(({ description, amount }) => ({ description, amount: Number(amount) })),
      subtotal,
      discount,
      total,
      status,
      issueDate,
      dueDate: dueDate || null,
      notes
    };

    const res = await createInvoice(data);
    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else {
      router.push('/dashboard/invoices');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          {error}
        </div>
      )}

      {/* Header Info */}
      <div className="rounded-xl border border-border bg-white shadow-sm p-6">
        <h2 className="text-lg font-bold text-text mb-4 border-b border-border pb-2">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-text-muted">Patient *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-border py-2 pl-9 pr-8 text-sm focus:border-[#006064] focus:outline-none"
                  required
                >
                  <option value="">Select a patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.full_name} ({p.phone})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-text-muted">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064] focus:outline-none"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-text-muted">Issue Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full rounded-lg border border-border py-2 pl-9 pr-4 text-sm focus:border-[#006064] focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-text-muted">Due Date (Optional)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-lg border border-border py-2 pl-9 pr-4 text-sm focus:border-[#006064] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-secondary/50">
          <h2 className="text-lg font-bold text-text">Line Items</h2>
          <button
            type="button"
            onClick={addLineItem}
            className="flex items-center text-sm font-medium text-[#006064] hover:underline"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Row
          </button>
        </div>
        
        <div className="p-6">
          <div className="hidden sm:grid sm:grid-cols-12 gap-4 mb-2 text-xs font-semibold uppercase text-text-muted">
            <div className="col-span-8">Description</div>
            <div className="col-span-3">Amount (₹)</div>
            <div className="col-span-1"></div>
          </div>
          
          <div className="space-y-3">
            {lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="col-span-1 sm:col-span-8">
                  <input
                    type="text"
                    placeholder="e.g. Physical Therapy Session"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064] focus:outline-none"
                    required
                  />
                </div>
                <div className="col-span-1 sm:col-span-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.amount || ''}
                      onChange={(e) => updateLineItem(item.id, 'amount', e.target.value)}
                      className="w-full rounded-lg border border-border py-2 pl-7 pr-3 text-sm focus:border-[#006064] focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="col-span-1 sm:col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length === 1}
                    className="p-2 text-text-muted hover:text-red-600 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="h-5 w-5 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Section */}
        <div className="border-t border-border bg-surface p-6">
          <div className="w-full sm:w-1/2 ml-auto space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted font-medium">Subtotal</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted font-medium">Discount</span>
              <div className="w-32 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount || ''}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full rounded-lg border border-border py-1.5 pl-7 pr-3 text-sm focus:border-[#006064] focus:outline-none text-right"
                />
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border mt-3">
              <span className="text-base font-bold text-text">Total</span>
              <span className="text-xl font-bold text-[#006064]">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-xl border border-border bg-white shadow-sm p-6">
        <label className="mb-2 block text-xs font-semibold uppercase text-text-muted">Notes / Terms (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Thank you for your business..."
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064] focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-4 pb-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-text hover:bg-surface-secondary transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center rounded-lg bg-[#006064] px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50 transition-colors"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Invoice
        </button>
      </div>

    </form>
  );
}
