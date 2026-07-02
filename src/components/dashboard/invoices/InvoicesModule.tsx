'use client';

import { useState, useMemo } from 'react';
import { Search, MapPin, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import InvoicesTable, { InvoiceData } from './InvoicesTable';

interface InvoicesModuleProps {
  initialInvoices: InvoiceData[];
}

export default function InvoicesModule({ initialInvoices }: InvoicesModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid' | 'overdue'>('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredInvoices = useMemo(() => {
    return initialInvoices.filter(inv => {
      const matchesSearch = 
        inv.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      // Date filter can be implemented later if needed, currently skipping complex date math for MVP
      return matchesSearch && matchesStatus;
    });
  }, [initialInvoices, searchQuery, statusFilter]);

  // Calculate KPIs
  const totalInvoiced = initialInvoices.reduce((sum, inv) => sum + Number(inv.total), 0);
  const totalCollected = initialInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + Number(inv.total), 0);
  const totalPending = initialInvoices
    .filter(inv => inv.status === 'unpaid' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + Number(inv.total), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">Invoices</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg border border-border bg-white p-1 shadow-sm">
            {['all', 'paid', 'unpaid', 'overdue'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                  statusFilter === status 
                    ? 'bg-surface-secondary text-text shadow-sm' 
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          
          <Link 
            href="/dashboard/invoices/new"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#006064] px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Invoice
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Total Invoiced</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-[#006064]">₹{totalInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <div className="flex items-center text-xs font-bold text-green-600 mb-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              12%
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-surface-secondary rounded-full overflow-hidden">
            <div className="h-full bg-[#006064] w-[40%] rounded-full"></div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Total Collected</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-green-700">₹{totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <div className="flex items-center text-xs font-bold text-green-600 mb-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              8%
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-surface-secondary rounded-full overflow-hidden">
            <div className="h-full bg-green-600 w-[60%] rounded-full"></div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Total Pending</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-red-600">₹{totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <div className="flex items-center text-xs font-bold text-red-600 mb-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              2%
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-surface-secondary rounded-full overflow-hidden">
            <div className="h-full bg-red-600 w-[20%] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by patient name or invoice #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white shadow-sm"
            />
          </div>
          
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-border py-2 px-3 text-sm focus:border-[#006064] focus:outline-none bg-white shadow-sm"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
          </select>
        </div>
      </div>

      <InvoicesTable invoices={filteredInvoices} />

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <p className="text-sm text-text-muted">
          Showing {filteredInvoices.length} of {initialInvoices.length} invoices
        </p>
        <div className="flex gap-2">
          {/* Mock Pagination */}
          <button className="rounded-lg border border-border p-2 text-text-muted hover:bg-surface-secondary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="rounded-lg bg-[#006064] px-4 py-2 text-sm font-medium text-white shadow-sm">
            1
          </button>
          <button className="rounded-lg border border-border p-2 text-text-muted hover:bg-surface-secondary">
            <svg className="h-4 w-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}
