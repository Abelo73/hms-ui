import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  Users, UserCheck, UserX, CalendarOff, UserPlus, Clock,
  Briefcase, DollarSign, CheckCircle, AlertCircle, TrendingUp, Cake,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { hrService, type HrDashboardKPIs } from '@/services/api/hrService';

const PIE_COLORS = ['#18181b', '#52525b', '#a1a1aa', '#d4d4d8', '#e4e4e7', '#f4f4f5'];

export interface KpiCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  sub?: string;
}

function KpiCard(props: KpiCardProps) {
  const { label, value, icon, color = 'bg-zinc-100 text-zinc-700', sub } = props;
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 flex items-start gap-4 shadow-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-zinc-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export function HrDashboardPage() {
  const [data, setData] = useState<HrDashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const result = await hrService.getHrDashboardKpis();
      setData(result);
    } catch {
      toast.error('Failed to load HR dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout pageTitle="HR Dashboard">
        <div className="w-full h-64 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout pageTitle="HR Dashboard">
        <div className="text-center py-16 text-zinc-500">Failed to load dashboard data.</div>
      </MainLayout>
    );
  }

  const activeRate = data.totalEmployees > 0
    ? Math.round((data.activeEmployees / data.totalEmployees) * 100)
    : 0;

  return (
    <MainLayout pageTitle="HR Dashboard">
      <div className="space-y-6">

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <KpiCard
            label="Total Employees"
            value={data.totalEmployees}
            icon={<Users className="w-5 h-5" />}
            color="bg-zinc-900 text-white"
            sub={`${activeRate}% active`}
          />
          <KpiCard
            label="Active"
            value={data.activeEmployees}
            icon={<UserCheck className="w-5 h-5" />}
            color="bg-green-100 text-green-700"
          />
          <KpiCard
            label="On Leave Today"
            value={data.onLeaveToday}
            icon={<CalendarOff className="w-5 h-5" />}
            color="bg-blue-100 text-blue-700"
          />
          <KpiCard
            label="New Hires"
            value={data.newHiresThisMonth}
            icon={<UserPlus className="w-5 h-5" />}
            color="bg-violet-100 text-violet-700"
            sub="this month"
          />
          <KpiCard
            label="Pending Leaves"
            value={data.pendingLeaveRequests}
            icon={<Clock className="w-5 h-5" />}
            color="bg-yellow-100 text-yellow-700"
            sub="awaiting approval"
          />
          <KpiCard
            label="Open Vacancies"
            value={data.openVacancies}
            icon={<Briefcase className="w-5 h-5" />}
            color="bg-orange-100 text-orange-700"
          />
          <KpiCard
            label="Payroll (Month)"
            value={`$${data.totalPayrollThisMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            icon={<DollarSign className="w-5 h-5" />}
            color="bg-emerald-100 text-emerald-700"
          />
          <KpiCard
            label="Present Today"
            value={data.presentToday}
            icon={<CheckCircle className="w-5 h-5" />}
            color="bg-teal-100 text-teal-700"
          />
          <KpiCard
            label="Late Today"
            value={data.lateToday}
            icon={<AlertCircle className="w-5 h-5" />}
            color="bg-red-100 text-red-700"
          />
          <KpiCard
            label="Inactive"
            value={data.inactiveEmployees}
            icon={<UserX className="w-5 h-5" />}
            color="bg-zinc-100 text-zinc-500"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Department headcount bar chart */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-zinc-500" />
              <h3 className="text-sm font-semibold text-zinc-900">Headcount by Department</h3>
            </div>
            {data.departmentHeadcount.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.departmentHeadcount} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ border: '1px solid #e4e4e7', borderRadius: 8, fontSize: 12 }}
                    cursor={{ fill: '#f4f4f5' }}
                  />
                  <Bar dataKey="count" fill="#18181b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-56 flex items-center justify-center text-zinc-400 text-sm">No data yet</div>
            )}
          </div>

          {/* Employee type pie chart */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">Employee Type Distribution</h3>
            {data.employeeTypeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.employeeTypeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {data.employeeTypeDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ border: '1px solid #e4e4e7', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-56 flex items-center justify-center text-zinc-400 text-sm">No data yet</div>
            )}
          </div>
        </div>

        {/* Leave trend + birthdays row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Monthly leaves trend */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">Leave Requests — Last 6 Months</h3>
            {data.monthlyLeavesTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data.monthlyLeavesTrend} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#71717a' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ border: '1px solid #e4e4e7', borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line
                    type="monotone"
                    dataKey="leaves"
                    stroke="#18181b"
                    strokeWidth={2}
                    dot={{ fill: '#18181b', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-44 flex items-center justify-center text-zinc-400 text-sm">No data yet</div>
            )}
          </div>

          {/* Upcoming birthdays */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Cake className="w-4 h-4 text-zinc-500" />
              <h3 className="text-sm font-semibold text-zinc-900">Upcoming Birthdays</h3>
            </div>
            {data.upcomingBirthdays.length > 0 ? (
              <div className="space-y-3">
                {data.upcomingBirthdays.slice(0, 5).map(b => (
                  <div key={b.employeeId} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-700 flex-shrink-0">
                      {b.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">{b.name}</p>
                      <p className="text-xs text-zinc-500">{b.department} · {b.dateOfBirth}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-zinc-400 text-sm">
                No birthdays in the next 7 days
              </div>
            )}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
