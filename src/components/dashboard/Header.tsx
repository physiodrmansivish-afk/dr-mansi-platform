'use client';

import { format } from 'date-fns';
import { Bell, Search, Menu } from 'lucide-react';

export default function Header({ onMenuClick, title }: { onMenuClick: () => void, title: string }) {
  const currentDate = format(new Date(), 'MMMM dd, yyyy').toUpperCase();

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border bg-white px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden rounded-lg p-2 text-text-muted hover:bg-surface-secondary"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">{title}</h1>
          <p className="text-xs font-medium tracking-wider text-text-muted">{currentDate}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search patients..." 
            className="w-64 rounded-full border border-border bg-surface-secondary py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <button className="relative rounded-full p-2 text-text hover:bg-surface-secondary">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
