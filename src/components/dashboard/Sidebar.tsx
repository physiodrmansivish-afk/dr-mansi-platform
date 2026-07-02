'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Receipt, 
  Clock, 
  Settings,
  Stethoscope,
  X
} from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Patients', href: '/dashboard/patients', icon: Users },
  { name: 'Invoices', href: '/dashboard/invoices', icon: Receipt },
  { name: 'Availability', href: '/dashboard/availability', icon: Clock },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[#006064] text-white"> {/* Dark teal from design */}
      <div className="flex items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Practice</h1>
            <h1 className="text-lg font-bold leading-tight">Management</h1>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-white/70 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2 px-4 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          // Exact match for dashboard home to avoid highlighting all routes
          const isReallyActive = item.href === '/dashboard' ? pathname === '/dashboard' : isActive;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors ${
                isReallyActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isReallyActive ? 'text-white' : 'text-white/70'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="flex items-center gap-3 rounded-lg bg-black/10 p-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-white/20 relative">
            <Image 
              src="/images/dr-mansi-portrait.jpg" 
              alt="Dr. Mansi" 
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Dr. M. Vishwakarma</p>
            <p className="text-xs text-white/70">Physiotherapist</p>
          </div>
        </div>
      </div>
    </div>
  );
}
