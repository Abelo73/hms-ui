import { MainLayout } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText,
  Plus,
  Stethoscope,
  Upload,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const admissionData = [
  { month: 'Jan', count: 400 },
  { month: 'Feb', count: 300 },
  { month: 'Mar', count: 600 },
  { month: 'Apr', count: 800 },
  { month: 'May', count: 500 },
  { month: 'Jun', count: 900 },
];

const occupancyData = [
  { name: 'General', value: 45 },
  { name: 'ICU', value: 25 },
  { name: 'Pediatrics', value: 20 },
  { name: 'Maternity', value: 10 },
];

const COLORS = ['#18181b', '#52525b', '#a1a1aa', '#e4e4e7'];

const recentActivities = [
  { id: 1, title: 'New patient registered', description: 'John Doe was added to the system', time: '2m ago' },
  { id: 2, title: 'Appointment scheduled', description: 'Dr. Smith - Cardiology checkup', time: '15m ago' },
  { id: 3, title: 'Lab results uploaded', description: 'Blood test results for patient #456', time: '1h ago' },
  { id: 4, title: 'Prescription issued', description: 'Antibiotics for patient #789', time: '2h ago' },
  { id: 5, title: 'Discharge processed', description: 'Patient #123 was discharged', time: '3h ago' },
];

const quickActions = [
  { title: 'Add Patient', sub: 'Register new patient', icon: Plus, path: '/patients' },
  { title: 'Schedule Appointment', sub: 'Book new appointments', icon: Calendar, path: '/appointments' },
  { title: 'Upload Document', sub: 'Add medical records', icon: Upload, path: '/medical/records' },
  { title: 'Start Consultation', sub: 'Begin patient visit', icon: Stethoscope, path: '/doctors/consultations' },
  { title: 'Lab Worklist', sub: 'View pending lab tests', icon: FileText, path: '/laboratory/worklist' },
  { title: 'Generate Report', sub: 'Analytics and insights', icon: BarChart3, path: '/reports' },
];

export function Dashboard() {
  const navigate = useNavigate();
  return (
    <MainLayout
      pageTitle="Dashboard"
      pageAction={
        <div className="text-xs text-zinc-400">Last updated: Jun 1, 2026</div>
      }
    >
      <div className="space-y-6">
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
          {/* Admissions Chart */}
          <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-[10px] p-5 min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-zinc-900">Patient Admissions</h3>
              <a href="#" className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="size-3" />
              </a>
            </div>
            <div className="flex-1 h-[220px] w-full">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={admissionData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#a1a1aa' }}
                    dy={8}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#a1a1aa' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e4e4e7', 
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#18181b'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#18181b" 
                    strokeWidth={1.5} 
                    dot={false}
                    activeDot={{ r: 3, stroke: '#18181b', strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Occupancy Chart */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-[10px] p-5 min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-zinc-900">Bed Occupancy by Ward</h3>
              <a href="#" className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="size-3" />
              </a>
            </div>
            <div className="flex-1 h-[220px] w-full">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="90%"
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {occupancyData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e4e4e7', 
                      borderRadius: '8px',
                      fontSize: '11px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-y-1.5 mt-4">
              {occupancyData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs text-zinc-500">{entry.name}</span>
                  <span className="text-xs font-medium text-zinc-900 ml-auto">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Quick Actions */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button 
                    key={action.title}
                    onClick={() => navigate(action.path)}
                    className="group flex items-start gap-3 bg-white border border-zinc-200 rounded-lg p-4 text-left transition-colors duration-150 hover:border-zinc-400 hover:bg-zinc-50 cursor-pointer"
                  >
                    <Icon className="size-[18px] text-zinc-700 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-zinc-900 leading-tight">{action.title}</div>
                      <div className="text-xs text-zinc-400 mt-0.5 truncate">{action.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-[10px] p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-900">Recent Activity</h3>
              <button className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">Clear all</button>
            </div>
            <div className="flex-1 relative">
              <div className="absolute left-[2.5px] top-2 bottom-4 w-px bg-zinc-100" />
              <div className="space-y-0 relative">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 py-3 border-b border-zinc-50 last:border-0 relative">
                    <div className="size-1.5 rounded-full bg-zinc-300 mt-[6px] flex-shrink-0 relative z-10 ring-4 ring-white" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <div className="text-sm font-medium text-zinc-800 leading-none truncate">{activity.title}</div>
                        <span className="text-xs text-zinc-400 whitespace-nowrap ml-auto">{activity.time}</span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-1 truncate">{activity.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full mt-4 py-2 text-xs font-medium text-zinc-600 bg-zinc-50 hover:bg-zinc-100 rounded-md transition-colors border border-zinc-200/50">
              Load more activity
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
