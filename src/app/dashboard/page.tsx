import CountUp from '@/components/dashboard/CountUp';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { Calendar as CalendarIcon, ClipboardList, Receipt, Users, ArrowRight, ArrowUpRight, CheckCircle2, Clock, XCircle, FileText, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { format, parse } from 'date-fns';

export default function DashboardOverview() {
  const metrics = {
    todayAppointments: 0,
    pendingPayments: 0,
    totalPatients: 0,
    thisMonthRevenue: 0
  };
  const upcomingAppointments: any[] = [];
  const recentActivity: any[] = [];

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Appointments */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50">
              <CalendarIcon className="h-6 w-6 text-[#006064]" />
            </div>
            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +2 today
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-text-muted">Today's Appointments</p>
            <p className="mt-2 text-3xl font-bold text-[#006064]">
              <CountUp end={metrics.todayAppointments} />
            </p>
          </div>
        </div>

        {/* Pending Confirmations */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
              <ClipboardList className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-text-muted">Pending Payments</p>
            <p className="mt-2 text-3xl font-bold text-orange-500">
              <CountUp end={metrics.pendingPayments} />
            </p>
          </div>
        </div>

        {/* Total Patients */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              Growth +5%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-text-muted">Total Patients</p>
            <p className="mt-2 text-3xl font-bold text-[#006064]">
              <CountUp end={metrics.totalPatients} />
            </p>
          </div>
        </div>

        {/* This Month's Revenue */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
              <Receipt className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-text-muted">This Month's Revenue</p>
            <p className="mt-2 text-3xl font-bold text-red-500">
              <CountUp end={metrics.thisMonthRevenue} prefix="₹" />
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Upcoming Appointments */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">Upcoming Appointments</h2>
              <Link href="/dashboard/appointments" className="flex items-center text-sm font-medium text-[#006064] hover:underline">
                View Calendar <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <p className="text-sm text-text-muted">No upcoming appointments.</p>
              ) : (
                upcomingAppointments.map((appt) => {
                  const startTime = format(parse(appt.start_time, 'HH:mm:ss', new Date()), 'hh:mm a');
                  const endTime = format(parse(appt.end_time, 'HH:mm:ss', new Date()), 'hh:mm a');
                  
                  return (
                    <div key={appt.id} className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-surface-secondary/50">
                      <div>
                        <div className="mb-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#006064]">
                          {startTime} - {endTime}
                        </div>
                        <h3 className="font-bold text-text">{appt.patient.full_name}</h3>
                        <p className="text-sm text-text-muted">Physiotherapy • {appt.area}</p>
                      </div>
                      
                      <div className="flex flex-col items-start gap-3 sm:items-end">
                        {appt.payment_status === 'paid' ? (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-bold tracking-wide text-green-700">
                            CONFIRMED
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold tracking-wide text-orange-700">
                            PENDING
                          </span>
                        )}
                        <div className="flex gap-2">
                          <button className="rounded border border-border px-3 py-1 text-xs font-medium text-text hover:bg-surface-secondary">
                            View
                          </button>
                          <button className="rounded border border-border px-3 py-1 text-xs font-medium text-text hover:bg-surface-secondary">
                            Reschedule
                          </button>
                          <button className="rounded border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100">
                            Mark Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Revenue Analytics */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-text">Revenue Analytics</h2>
            <RevenueChart />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-text">Recent Activity</h2>
            <div className="relative space-y-6">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-text-muted">No recent activity.</p>
              ) : (
                recentActivity.map((activity, idx) => {
                  let Icon = CheckCircle2;
                  let bg = 'bg-blue-100 text-blue-600';
                  
                  if (activity.type === 'booking') { Icon = CalendarIcon; bg = 'bg-blue-100 text-blue-600'; }
                  if (activity.type === 'payment') { Icon = Receipt; bg = 'bg-green-100 text-green-600'; }
                  if (activity.type === 'patient') { Icon = UserPlus; bg = 'bg-purple-100 text-purple-600'; }

                  const isLast = idx === recentActivity.length - 1;

                  return (
                    <div key={activity.id} className="relative flex gap-4">
                      {!isLast && (
                        <span className="absolute left-4 top-10 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                      )}
                      <div className={`relative flex h-8 w-8 flex-none items-center justify-center rounded-full ${bg}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col pt-1.5">
                        <p className="text-sm font-medium text-text">{activity.message}</p>
                        <p className="text-xs text-text-muted">
                          {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Clinical Notes Placeholder */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-text">Recent Clinical Notes</h2>
            <div className="space-y-4">
              <div className="border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-text">Sarah Jenkins</h3>
                  <span className="text-xs text-text-muted">2h ago</span>
                </div>
                <p className="mt-1 text-sm text-text-muted">Updated rehab protocol for ACL recovery</p>
              </div>
              <div className="border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-text">Robert Fox</h3>
                  <span className="text-xs text-text-muted">5h ago</span>
                </div>
                <p className="mt-1 text-sm text-text-muted">Prescribed home exercises for lower back</p>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-text">Monica Geller</h3>
                  <span className="text-xs text-text-muted">Yesterday</span>
                </div>
                <p className="mt-1 text-sm text-text-muted">Patient reported 40% improvement in mobility</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
