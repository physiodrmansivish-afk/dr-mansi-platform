'use client';

import { Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PatientCardProps {
  id: string;
  name: string;
  phone: string;
  area: string;
  totalSessions: number;
  lastVisit: string | null;
  isActive: boolean;
}

export default function PatientCard({
  id,
  name,
  phone,
  area,
  totalSessions,
  lastVisit,
  isActive
}: PatientCardProps) {
  const router = useRouter();
  
  const getInitials = (fullName: string) => {
    return fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col rounded-xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#006064] text-lg font-bold text-white">
          {getInitials(name)}
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="mt-4 flex-1">
        <h3 className="text-lg font-bold text-text truncate" title={name}>{name}</h3>
        
        <div className="mt-2 space-y-2 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{area}</span>
          </div>
        </div>
      </div>

      <div className="my-5 grid grid-cols-2 gap-4 border-t border-border pt-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Total Sessions</p>
          <p className="mt-1 font-semibold text-text">{totalSessions} Sessions</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Last Visit</p>
          <p className="mt-1 font-semibold text-text">{lastVisit || 'Never'}</p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <Link 
          href={`/dashboard/patients/${id}`}
          className="flex items-center justify-center rounded-lg border border-[#006064] px-4 py-2 text-sm font-medium text-[#006064] hover:bg-[#006064] hover:text-white transition-colors"
        >
          View Profile
        </Link>
        <button 
          onClick={() => router.push('/dashboard/invoices/new')}
          className="flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface-secondary transition-colors"
        >
          New Invoice
        </button>
      </div>
    </div>
  );
}
