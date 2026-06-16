import { 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { patientsService } from '@/services/api/patientsService';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: any;
  trend: 'up' | 'down';
  color?: string;
}

function StatCard({ title, value, change, icon: Icon, trend, color }: StatCardProps) {
  return (
    <div className="relative group bg-white border border-zinc-200 rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:border-zinc-300">
      <div className="flex items-center justify-between mb-3">
        <div className={cn(
          "p-2 rounded-lg bg-zinc-50 group-hover:bg-zinc-100 transition-colors",
          color
        )}>
          <Icon className="size-4 text-zinc-600" />
        </div>
        <div className={cn(
          "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium",
          trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {trend === 'up' ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {change}
        </div>
      </div>
      <div>
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{title}</span>
        <div className="text-2xl font-bold text-zinc-900 mt-0.5 tracking-tight">{value}</div>
      </div>
      <div className="mt-4 h-1 w-full bg-zinc-50 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500",
            trend === 'up' ? "bg-emerald-500" : "bg-red-500"
          )} 
          style={{ width: '65%' }} 
        />
      </div>
    </div>
  );
}

export function StatCards() {
  const [totalPatients, setTotalPatients] = useState('1,234');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await patientsService.getAllPatients();
        if (data) {
          setTotalPatients(data.length.toLocaleString());
        }
      } catch (error) {
        console.error('Failed to fetch patients count:', error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: 'Total Patients', value: totalPatients, change: '+12.5%', icon: Users, trend: 'up' as const },
    { title: 'Appointments Today', value: '42', change: '+18.2%', icon: Calendar, trend: 'up' as const },
    { title: 'Active Staff', value: '156', change: '+4.1%', icon: Activity, trend: 'up' as const },
    { title: 'Monthly Revenue', value: '$124.5K', change: '+22.4%', icon: TrendingUp, trend: 'up' as const },
    { title: 'Bed Occupancy', value: '82%', change: '+3.1%', icon: BarChart3, trend: 'up' as const },
    { title: 'Pending Reports', value: '12', change: '-2.4%', icon: FileText, trend: 'down' as const },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
