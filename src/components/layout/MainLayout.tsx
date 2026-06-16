import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import {
  Users,
  Calendar,
  Activity,
  TrendingUp,
  BarChart3,
  FileText,
} from 'lucide-react';

const stats = [
  { title: 'Total patients', value: '1,234', change: '+12%', icon: Users, trend: 'up' },
  { title: 'Appointments today', value: '24', change: '+5%', icon: Calendar, trend: 'up' },
  { title: 'Active staff', value: '156', change: '+3%', icon: Activity, trend: 'up' },
  { title: 'Revenue', value: '$45.2K', change: '+8%', icon: TrendingUp, trend: 'up' },
  { title: 'Bed occupancy', value: '78%', change: '+4%', icon: BarChart3, trend: 'up' },
  { title: 'Pending documents', value: '8', change: '-2%', icon: FileText, trend: 'down' },
];

interface MainLayoutProps {
  children: ReactNode;
  /** Page title shown below stat cards */
  pageTitle?: string;
  /** Alias for pageTitle */
  title?: string;
  /** Optional subtitle (ignored, kept for compat) */
  subtitle?: string;
  /** Optional call to action element placed next to page title */
  pageAction?: ReactNode;
}

export function MainLayout({ children, pageTitle, title, pageAction }: MainLayoutProps) {
  const { isCollapsed } = useSidebar();
  const resolvedTitle = pageTitle || title;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0',
          isCollapsed ? 'ml-14' : 'ml-[220px]'
        )}
      >
        <TopNav />

        <main className="flex-1 p-6 mt-14 overflow-visible">
          {/* ── Stat Cards ── always visible on every page ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="relative bg-white border border-zinc-200 rounded-[10px] p-5 flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <Icon className="absolute top-4 right-4 size-4 text-zinc-300" />
                  <span className="text-xs font-normal text-zinc-500">{stat.title}</span>
                  <div className="pt-1">
                    <div className="text-[28px] font-semibold text-zinc-900 leading-tight tracking-tight">
                      {stat.value}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[12px]">
                      <span
                        className={cn(
                          'font-medium',
                          stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                        )}
                      >
                        {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                      </span>
                      <span className="text-zinc-400">vs last month</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Page-level header ── */}
          {(resolvedTitle || pageAction) && (
            <div className="flex items-center justify-between mb-5">
              {resolvedTitle && (
                <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
                  {resolvedTitle}
                </h1>
              )}
              {pageAction && <div>{pageAction}</div>}
            </div>
          )}

          {/* ── Page content ── */}
          {children}
        </main>
      </div>
    </div>
  );
}
