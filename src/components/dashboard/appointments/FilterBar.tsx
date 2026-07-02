'use client';

import { Search, Calendar, List, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';

interface FilterBarProps {
  view: 'list' | 'calendar';
  onViewChange: (view: 'list' | 'calendar') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export default function FilterBar({
  view,
  onViewChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}: FilterBarProps) {
  // Hardcoded date range for this view just to match the visual design
  // In a full implementation, you'd integrate react-day-picker here
  const dateRangeStr = `${format(new Date(), 'MMM dd, yyyy')} - ${format(new Date(Date.now() + 7 * 86400000), 'MMM dd, yyyy')}`;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Date Range Picker Placeholder */}
        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
          <Calendar className="h-4 w-4 text-text-muted" />
          <span>{dateRangeStr}</span>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
          <Filter className="h-4 w-4 text-text-muted" />
          <select 
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-transparent text-sm focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="booked">Booked (Pending)</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search patient name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-border py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* View Toggles */}
        <div className="flex items-center rounded-lg border border-border p-1 bg-surface-secondary">
          <button
            onClick={() => onViewChange('list')}
            className={`rounded-md p-1.5 ${view === 'list' ? 'bg-white shadow-sm' : 'text-text-muted hover:text-text'}`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewChange('calendar')}
            className={`rounded-md p-1.5 ${view === 'calendar' ? 'bg-white shadow-sm' : 'text-text-muted hover:text-text'}`}
          >
            <Calendar className="h-4 w-4" />
          </button>
        </div>

        {/* Export */}
        <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-surface-secondary">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </div>
  );
}
