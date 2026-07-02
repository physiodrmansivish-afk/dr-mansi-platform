'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Don't wrap the login page with the dashboard shell
  if (pathname === '/dashboard/login') {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  // Derive title from pathname
  let title = 'Dashboard';
  if (pathname.includes('/appointments')) title = 'Appointments';
  else if (pathname.includes('/patients')) title = 'Patients';
  else if (pathname.includes('/invoices')) title = 'Invoices';
  else if (pathname.includes('/availability')) title = 'Availability';
  else if (pathname.includes('/settings')) title = 'Settings';

  return (
    <html lang="en">
      <body className="bg-[#F8FAFC]">
        <div className="flex h-screen w-full overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden md:block md:w-64 md:shrink-0">
            <Sidebar />
          </div>

          {/* Mobile Sidebar overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div 
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 w-64 shadow-xl">
                <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header 
              title={title} 
              onMenuClick={() => setIsMobileMenuOpen(true)} 
            />
            
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
