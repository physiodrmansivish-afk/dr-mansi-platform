'use client';

import { useState, useEffect } from 'react';
import { Settings, MapPin, Briefcase, Clock, Building, MessageSquare, Save, Plus, Trash2, CheckCircle } from 'lucide-react';
import { updateSettingsSection } from '@/app/dashboard/settings/actions';
import toast from 'react-hot-toast';

interface SettingsModuleProps {
  initialSettings: any;
}

export default function SettingsModule({ initialSettings }: SettingsModuleProps) {
  const [activeTab, setActiveTab] = useState('clinic');
  
  const showToast = (msg: string) => {
    toast.success(msg);
  };

  // --- Clinic Info State ---
  const [clinicInfo, setClinicInfo] = useState(initialSettings.clinicInfo);
  const handleClinicSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettingsSection('clinicInfo', clinicInfo);
    showToast('Clinic information saved successfully.');
  };

  // --- Working Hours State ---
  const [workingHours, setWorkingHours] = useState(initialSettings.workingHours);
  const handleWorkingHoursSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettingsSection('workingHours', workingHours);
    showToast('Working hours saved successfully.');
  };

  const toggleDay = (day: string) => {
    const days = [...workingHours.days];
    if (days.includes(day)) {
      setWorkingHours({ ...workingHours, days: days.filter(d => d !== day) });
    } else {
      setWorkingHours({ ...workingHours, days: [...days, day] });
    }
  };

  // --- Service Areas State ---
  const [serviceAreas, setServiceAreas] = useState<string[]>(initialSettings.serviceAreas);
  const [newArea, setNewArea] = useState('');
  const handleAreaSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettingsSection('serviceAreas', serviceAreas);
    showToast('Service areas saved successfully.');
  };

  // --- Services State ---
  const [services, setServices] = useState<any[]>(initialSettings.services);
  const handleServicesSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettingsSection('services', services);
    showToast('Services configuration saved successfully.');
  };

  const tabs = [
    { id: 'clinic', label: 'Clinic Info', icon: Building },
    { id: 'hours', label: 'Working Hours', icon: Clock },
    { id: 'areas', label: 'Service Areas', icon: MapPin },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#006064]">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Manage your clinic profile, operating hours, and services.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#006064] text-white shadow-sm' 
                    : 'text-text hover:bg-surface-secondary'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl border border-border shadow-sm min-h-[500px]">
          
          {/* Clinic Info Tab */}
          {activeTab === 'clinic' && (
            <form onSubmit={handleClinicSave} className="p-6 sm:p-8 animate-in fade-in">
              <h2 className="text-lg font-bold text-text border-b border-border pb-4 mb-6">Clinic Information</h2>
              
              <div className="space-y-5 max-w-xl">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-text">Clinic Name</label>
                  <input
                    type="text"
                    value={clinicInfo.name}
                    onChange={e => setClinicInfo({ ...clinicInfo, name: e.target.value })}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064] focus:outline-none"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-text">Phone Number</label>
                    <input
                      type="text"
                      value={clinicInfo.phone}
                      onChange={e => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-text">WhatsApp Number</label>
                    <input
                      type="text"
                      value={clinicInfo.whatsappNumber}
                      onChange={e => setClinicInfo({ ...clinicInfo, whatsappNumber: e.target.value })}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-text">Full Address</label>
                  <textarea
                    value={clinicInfo.address}
                    onChange={e => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064] focus:outline-none"
                    required
                  />
                  <p className="text-xs text-text-muted mt-1">This address will appear on generated invoices.</p>
                </div>

                <div className="pt-6">
                  <button type="submit" className="flex items-center rounded-lg bg-[#006064] px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Working Hours Tab */}
          {activeTab === 'hours' && (
            <form onSubmit={handleWorkingHoursSave} className="p-6 sm:p-8 animate-in fade-in">
              <h2 className="text-lg font-bold text-text border-b border-border pb-4 mb-6">Operating Hours</h2>
              
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-text">Working Days</label>
                  <div className="flex flex-wrap gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
                          workingHours.days.includes(day)
                            ? 'bg-[#E0F2F1] border-[#006064] text-[#006064]'
                            : 'bg-white border-border text-text-muted'
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6 pt-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-text">Start Time</label>
                    <input
                      type="time"
                      value={workingHours.startTime}
                      onChange={e => setWorkingHours({ ...workingHours, startTime: e.target.value })}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-text">End Time</label>
                    <input
                      type="time"
                      value={workingHours.endTime}
                      onChange={e => setWorkingHours({ ...workingHours, endTime: e.target.value })}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-text">Slot Duration (min)</label>
                    <select
                      value={workingHours.slotDuration}
                      onChange={e => setWorkingHours({ ...workingHours, slotDuration: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064] focus:outline-none"
                    >
                      <option value={30}>30 mins</option>
                      <option value={45}>45 mins</option>
                      <option value={60}>60 mins</option>
                      <option value={90}>90 mins</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="flex items-center rounded-lg bg-[#006064] px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90">
                    <Save className="mr-2 h-4 w-4" /> Save Schedule
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Service Areas Tab */}
          {activeTab === 'areas' && (
            <form onSubmit={handleAreaSave} className="p-6 sm:p-8 animate-in fade-in flex flex-col h-full">
              <h2 className="text-lg font-bold text-text border-b border-border pb-4 mb-6">Serviceable Localities</h2>
              
              <div className="max-w-2xl flex-1 flex flex-col">
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={newArea}
                    onChange={e => setNewArea(e.target.value)}
                    placeholder="Enter locality name..."
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064] focus:outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (newArea.trim() && !serviceAreas.includes(newArea.trim())) {
                        setServiceAreas([...serviceAreas, newArea.trim()]);
                        setNewArea('');
                      }
                    }}
                    className="flex items-center rounded-lg bg-surface-secondary border border-border px-4 py-2 text-sm font-medium text-text hover:bg-gray-100"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Area
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 flex-1 content-start">
                  {serviceAreas.map(area => (
                    <div key={area} className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 border border-border">
                      <span className="text-sm font-medium text-text">{area}</span>
                      <button 
                        type="button"
                        onClick={() => setServiceAreas(serviceAreas.filter(a => a !== area))}
                        className="text-text-muted hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-6 mt-6 border-t border-border">
                  <button type="submit" className="flex items-center rounded-lg bg-[#006064] px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90">
                    <Save className="mr-2 h-4 w-4" /> Save Service Areas
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <form onSubmit={handleServicesSave} className="p-6 sm:p-8 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <h2 className="text-lg font-bold text-text">Therapy Services</h2>
                <button 
                  type="button"
                  onClick={() => setServices([...services, { id: Date.now().toString(), name: '', description: '', duration: 60, price: 0 }])}
                  className="flex items-center text-sm font-medium text-[#006064] hover:underline"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Service
                </button>
              </div>
              
              <div className="space-y-4 max-w-4xl">
                {services.map((svc, idx) => (
                  <div key={svc.id} className="rounded-lg border border-border bg-surface-secondary/30 p-4">
                    <div className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-12 sm:col-span-5 space-y-3">
                        <input
                          type="text"
                          value={svc.name}
                          onChange={e => {
                            const updated = [...services];
                            updated[idx].name = e.target.value;
                            setServices(updated);
                          }}
                          placeholder="Service Name"
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064] font-bold"
                          required
                        />
                        <textarea
                          value={svc.description}
                          onChange={e => {
                            const updated = [...services];
                            updated[idx].description = e.target.value;
                            setServices(updated);
                          }}
                          placeholder="Description..."
                          rows={2}
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064]"
                        />
                      </div>
                      <div className="col-span-5 sm:col-span-3">
                        <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Duration (min)</label>
                        <input
                          type="number"
                          value={svc.duration}
                          onChange={e => {
                            const updated = [...services];
                            updated[idx].duration = Number(e.target.value);
                            setServices(updated);
                          }}
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064]"
                          required
                        />
                      </div>
                      <div className="col-span-5 sm:col-span-3">
                        <label className="text-xs font-semibold text-text-muted uppercase mb-1 block">Price (₹)</label>
                        <input
                          type="number"
                          value={svc.price}
                          onChange={e => {
                            const updated = [...services];
                            updated[idx].price = Number(e.target.value);
                            setServices(updated);
                          }}
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-[#006064]"
                          required
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1 flex justify-end pt-5">
                        <button 
                          type="button"
                          onClick={() => setServices(services.filter((_, i) => i !== idx))}
                          className="p-2 text-text-muted hover:text-red-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 mt-6">
                <button type="submit" className="flex items-center rounded-lg bg-[#006064] px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90">
                  <Save className="mr-2 h-4 w-4" /> Save Services
                </button>
              </div>
            </form>
          )}

          {/* WhatsApp Templates Tab */}
          {activeTab === 'whatsapp' && (
            <div className="p-6 sm:p-8 animate-in fade-in">
              <h2 className="text-lg font-bold text-text border-b border-border pb-4 mb-6">WhatsApp Integrations</h2>
              
              <div className="max-w-2xl">
                <div className="rounded-lg bg-[#E0F2F1] p-4 text-sm text-[#006064] mb-6">
                  These templates are configured in your AiSensy dashboard. They are mapped here for reference to ensure transactional messages match the approved templates.
                </div>
                
                <div className="space-y-4">
                  {initialSettings.whatsappTemplates.map((tpl: any) => (
                    <div key={tpl.name} className="flex justify-between items-center rounded-lg border border-border p-4">
                      <div>
                        <h4 className="font-bold text-text">{tpl.name}</h4>
                        <p className="text-sm text-text-muted mt-1">{tpl.description}</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
