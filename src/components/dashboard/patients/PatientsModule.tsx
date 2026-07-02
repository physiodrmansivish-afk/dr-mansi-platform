'use client';

import { useState, useMemo } from 'react';
import { Search, MapPin, UserPlus } from 'lucide-react';
import PatientCard from './PatientCard';

export interface PatientWithStats {
  id: string;
  full_name: string;
  phone: string;
  area: string;
  total_sessions: number;
  last_visit: string | null;
  is_active: boolean;
}

interface PatientsModuleProps {
  initialPatients: PatientWithStats[];
}

export default function PatientsModule({ initialPatients }: PatientsModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');

  const areas = Array.from(new Set(initialPatients.map(p => p.area))).sort();

  const filteredPatients = useMemo(() => {
    return initialPatients.filter(patient => {
      const matchesSearch = patient.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            patient.phone.includes(searchQuery);
      const matchesArea = areaFilter === 'all' || patient.area === areaFilter;
      return matchesSearch && matchesArea;
    });
  }, [initialPatients, searchQuery, areaFilter]);

  const activeToday = initialPatients.filter(p => p.last_visit && p.last_visit.startsWith(new Date().toISOString().split('T')[0])).length;
  const totalPatients = initialPatients.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#006064]">Patient Records</h1>
          <p className="text-sm text-text-muted mt-1">Manage and view detailed history for your active patients.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-surface-secondary px-4 py-2 border border-border">
            <span className="text-sm text-text-muted">Total Patients: </span>
            <span className="text-sm font-bold text-[#006064]">{totalPatients}</span>
          </div>
          <div className="rounded-lg bg-surface-secondary px-4 py-2 border border-border">
            <span className="text-sm text-text-muted">Active Today: </span>
            <span className="text-sm font-bold text-green-700">{activeToday}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-xl border border-border bg-white p-4 shadow-sm">
        
        <div className="flex flex-1 gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search patients by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-surface-secondary/50"
            />
          </div>

          {/* Area Filter */}
          <div className="relative w-48">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border py-2 pl-9 pr-8 text-sm focus:border-primary focus:outline-none bg-white"
            >
              <option value="all">All Areas</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#006064] px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90">
          <UserPlus className="h-4 w-4" />
          Add New Patient
        </button>

      </div>

      {/* Grid */}
      {filteredPatients.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-12 text-center flex flex-col items-center justify-center">
          <div className="rounded-full bg-surface-secondary p-4 mb-4">
            <Search className="h-8 w-8 text-text-muted/60" />
          </div>
          <h3 className="text-lg font-bold text-text mb-1">No Patients Found</h3>
          <p className="text-sm text-text-muted">We couldn't find any patients matching your current search or area filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              id={patient.id}
              name={patient.full_name}
              phone={patient.phone}
              area={patient.area}
              totalSessions={patient.total_sessions}
              lastVisit={patient.last_visit ? new Date(patient.last_visit).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : null}
              isActive={patient.is_active}
            />
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <p className="text-sm text-text-muted">
          Showing {filteredPatients.length} of {totalPatients} patients
        </p>
        <div className="flex gap-2">
          {/* Mock Pagination */}
          <button className="rounded-lg border border-border p-2 text-text-muted hover:bg-surface-secondary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="rounded-lg bg-[#006064] px-4 py-2 text-sm font-medium text-white">
            1
          </button>
        </div>
      </div>
    </div>
  );
}
