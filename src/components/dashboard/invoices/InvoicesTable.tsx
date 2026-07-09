'use client';

import { useState } from 'react';
import { Eye, CheckCircle, Download, Bell, X, FileText, Loader2, IndianRupee } from 'lucide-react';
import { format, parse } from 'date-fns';

interface LineItem {
  description: string;
  amount: number;
}

export interface InvoiceData {
  id: string;
  invoice_number: string;
  patient_id: string;
  appointment_id: string | null;
  line_items: LineItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  issue_date: string;
  due_date: string | null;
  notes: string | null;
  patient_name: string;
}

interface InvoicesTableProps {
  invoices: InvoiceData[];
}

export default function InvoicesTable({ invoices }: InvoicesTableProps) {
  const [viewingInvoice, setViewingInvoice] = useState<InvoiceData | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<InvoiceData | null>(null);

  // Payment Modal State
  const [payMethod, setPayMethod] = useState('cash');
  const [payReference, setPayReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setPayingInvoice(null);
    }, 500);
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text">
            <thead className="border-b border-border bg-surface-secondary text-xs font-semibold uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-text-muted">
                      <div className="rounded-full bg-surface-secondary p-4 mb-4">
                        <FileText className="h-8 w-8 text-text-muted/60" />
                      </div>
                      <h3 className="text-lg font-bold text-text mb-1">No Invoices Found</h3>
                      <p className="text-sm">We couldn't find any invoices matching your current filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const dateStr = format(parse(inv.issue_date, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy');
                  
                  // For "Service" column, display the first line item description
                  const firstService = inv.line_items?.[0]?.description || 'Multiple Services';

                  return (
                    <tr key={inv.id} className="hover:bg-surface-secondary/30 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-[#006064]">
                        #{inv.invoice_number}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-text-muted">
                        {dateStr}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E0F2F1] text-xs font-bold text-[#006064]">
                            {getInitials(inv.patient_name)}
                          </div>
                          <span className="font-semibold text-text">{inv.patient_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-muted max-w-[200px] truncate" title={firstService}>
                        {firstService}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-bold text-text">
                        ₹{Number(inv.total).toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {/* We don't have exact payment method here unless joined, but we mimic design */}
                        <div className="flex items-center gap-1 text-text-muted text-xs">
                          {inv.status === 'paid' ? <CheckCircle className="h-3 w-3 text-green-600" /> : <IndianRupee className="h-3 w-3" />}
                          {inv.status === 'paid' ? 'Paid' : '-'}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          inv.status === 'paid' ? 'bg-green-100 text-green-800' :
                          inv.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setViewingInvoice(inv)}
                            className="p-1.5 text-text-muted hover:text-[#006064] transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {inv.status !== 'paid' && (
                            <button 
                              onClick={() => setPayingInvoice(inv)}
                              className="p-1.5 text-text-muted hover:text-green-600 transition-colors"
                              title="Mark as Paid"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button 
                            className="p-1.5 text-text-muted hover:text-text transition-colors"
                            title="Download PDF (Coming Soon)"
                            onClick={() => alert('PDF generation will be implemented in the future.')}
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          {inv.status === 'overdue' && (
                            <button 
                              className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                              title="Send Reminder"
                            >
                              <Bell className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Drawer for Detail View */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-surface h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
              <h2 className="text-lg font-bold text-text">Invoice Details</h2>
              <button 
                onClick={() => setViewingInvoice(null)}
                className="rounded p-1 text-text-muted hover:bg-surface-secondary hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm mb-6">
                <div className="flex justify-between items-start mb-6 border-b border-border pb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Invoice To</p>
                    <p className="mt-1 font-bold text-lg">{viewingInvoice.patient_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Invoice No.</p>
                    <p className="mt-1 font-semibold text-[#006064]">{viewingInvoice.invoice_number}</p>
                    <p className="text-xs text-text-muted mt-1">Issued: {viewingInvoice.issue_date}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase text-text-muted border-b border-border pb-2">
                    <span>Description</span>
                    <span>Amount</span>
                  </div>
                  {viewingInvoice.line_items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                      <span className="text-text">{item.description}</span>
                      <span className="font-medium text-text">₹{Number(item.amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>Subtotal</span>
                    <span>₹{Number(viewingInvoice.subtotal).toFixed(2)}</span>
                  </div>
                  {Number(viewingInvoice.discount) > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{Number(viewingInvoice.discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-[#006064] pt-2 border-t border-border">
                    <span>Total Amount</span>
                    <span>₹{Number(viewingInvoice.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {viewingInvoice.notes && (
                <div className="rounded-lg bg-surface-secondary p-4 text-sm text-text-muted">
                  <span className="font-bold text-text block mb-1">Notes:</span>
                  {viewingInvoice.notes}
                </div>
              )}
            </div>

            <div className="border-t border-border bg-white p-4 flex gap-3">
              <button 
                className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-text hover:bg-surface-secondary transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" /> Download PDF
              </button>
              {viewingInvoice.status !== 'paid' && (
                <button 
                  onClick={() => {
                    setPayingInvoice(viewingInvoice);
                    setViewingInvoice(null);
                  }}
                  className="flex-1 rounded-lg bg-[#006064] py-2 text-sm font-medium text-white hover:bg-opacity-90 transition-colors"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Recording Payment */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleRecordPayment}>
              <div className="border-b border-border px-6 py-4 flex justify-between items-center bg-surface-secondary/50">
                <h2 className="text-lg font-bold text-text">Record Payment</h2>
                <button 
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="rounded p-1 text-text-muted hover:bg-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="rounded-lg bg-blue-50 p-4 border border-blue-100 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Amount Due</p>
                    <p className="font-semibold text-blue-900">{payingInvoice.invoice_number}</p>
                  </div>
                  <p className="text-2xl font-bold text-[#006064]">₹{Number(payingInvoice.total).toFixed(2)}</p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-text-muted">Payment Method *</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064] focus:outline-none"
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="paytm">Paytm</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-text-muted">Reference / Txn ID (Optional)</label>
                  <input
                    type="text"
                    value={payReference}
                    onChange={(e) => setPayReference(e.target.value)}
                    placeholder="e.g. UTR number, PhonePe Txn ID"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064] focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-border bg-surface px-6 py-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-text hover:bg-surface-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
