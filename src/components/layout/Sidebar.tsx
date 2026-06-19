import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  Menu,
  X,
  CheckCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  PieChart,
  Shield,
  Activity,
  Pill,
  FlaskConical,
  Syringe,
  Heart,
  Thermometer,
  ClipboardCheck,
  Droplets,
  Clock,
  AlertTriangle,
  Stethoscope,
  Beaker,
  Package,
  Truck,
  Briefcase,
  CalendarDays,
  DollarSign,
  Star,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const isAdmin = user?.roles?.includes('ADMIN');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  // Effect to auto-expand the section containing the current route
  useEffect(() => {
    if (isCollapsed) {
      setExpandedSection(null);
      return;
    }

    const currentPath = location.pathname;
    const activeSection = sections.find(section =>
      section.items.some(item => item.path === currentPath)
    );

    if (activeSection) {
      setExpandedSection(activeSection.id);
    }
  }, [location.pathname, isCollapsed]);

  const toggleSection = (sectionId: string) => {
    if (isCollapsed) return;
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const sections = [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      ]
    },
    {
      id: 'people',
      label: 'Patient Management',
      items: [
        { icon: Users, label: 'Patients', path: '/patients' },
        ...(isAdmin ? [{ icon: Users, label: 'Users', path: '/users' }] : []),
      ]
    },
    {
      id: 'medical',
      label: 'Medical Services',
      items: [
        { icon: Activity, label: 'Allergies', path: '/medical/allergies' },
        { icon: Pill, label: 'Medications', path: '/medical/medications' },
        { icon: FlaskConical, label: 'Lab Results', path: '/medical/lab-results' },
        { icon: Syringe, label: 'Vaccinations', path: '/medical/vaccinations' },
        { icon: FileText, label: 'Medical History', path: '/medical/history' },
        { icon: Stethoscope, label: 'Consultations', path: '/doctors/consultations' },
        { icon: Beaker, label: 'Lab Worklist', path: '/laboratory/worklist' },
      ]
    },
    {
      id: 'nursing',
      label: 'Nursing Care',
      items: [
        { icon: Heart, label: 'Care Plans', path: '/nursing/care-plans' },
        { icon: Thermometer, label: 'Vital Signs', path: '/nursing/vital-signs' },
        { icon: ClipboardCheck, label: 'Tasks', path: '/nursing/tasks' },
        { icon: Syringe, label: 'Medications', path: '/nursing/medication-administrations' },
        { icon: FileText, label: 'Nursing Notes', path: '/nursing/notes' },
        { icon: AlertTriangle, label: 'Incident Reports', path: '/nursing/incident-reports' },
        { icon: Stethoscope, label: 'Assessments', path: '/nursing/assessments' },
        { icon: Heart, label: 'Wound Care', path: '/nursing/wound-care' },
        { icon: Droplets, label: 'Fluid Balance', path: '/nursing/fluid-balance' },
        { icon: Clock, label: 'Nursing Shifts', path: '/nursing/shifts' },
      ]
    },
    {
      id: 'operations',
      label: 'Operations',
      items: [
        { icon: Calendar, label: 'Appointments', path: '/appointments' },
        { icon: FileText, label: 'Documents', path: '/documents' },
        { icon: PieChart, label: 'Reports', path: '/reports' },
      ]
    },
    {
      id: 'inventory',
      label: 'Inventory Management',
      items: [
        { icon: Package, label: 'Dashboard', path: '/inventory' },
        { icon: Package, label: 'Item Catalog', path: '/inventory/items' },
        { icon: Truck, label: 'Procurement', path: '/inventory/procurement' },
        { icon: Droplets, label: 'Stock Levels', path: '/inventory/stock' },
      ]
    },
    {
      id: 'pharmacy',
      label: 'Pharmacy',
      items: [
        { icon: Pill, label: 'Prescriptions', path: '/pharmacy/prescriptions' },
        { icon: Activity, label: 'Dispensing', path: '/pharmacy/prescriptions' }, // Link to same list for now
        { icon: Beaker, label: 'Drug Catalog', path: '/pharmacy/drugs' },
      ]
    },
    {
      id: 'hr',
      label: 'Human Resources',
      items: [
        { icon: Briefcase, label: 'Employees', path: '/hr/employees' },
        { icon: CalendarDays, label: 'Leave Requests', path: '/hr/leave-requests' },
        { icon: Clock, label: 'Attendance', path: '/hr/attendance' },
        { icon: DollarSign, label: 'Payroll', path: '/hr/payroll' },
        { icon: Star, label: 'Performance Reviews', path: '/hr/performance-reviews' },
        { icon: Briefcase, label: 'Recruitment', path: '/hr/recruitment' },
        { icon: GraduationCap, label: 'Training', path: '/hr/training' },
        { icon: Heart, label: 'Benefits', path: '/hr/benefits' },
        { icon: ShieldCheck, label: 'Compliance', path: '/hr/compliance' },
      ]
    },
    {
      id: 'admin',
      label: 'Administration',
      items: [
        ...(isAdmin ? [
          { icon: CheckCircle, label: 'Approvals', path: '/approvals' },
          { icon: Shield, label: 'Roles', path: '/roles' }
        ] : []),
        { icon: Settings, label: 'Settings', path: '/profile' },
      ]
    }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg border border-zinc-200 shadow-sm hover:bg-zinc-50"
      >
        {isMobileOpen ? <X className="size-5 text-zinc-600" /> : <Menu className="size-5 text-zinc-600" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white border-r border-zinc-200 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-14" : "w-[220px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-14 px-4 border-b border-zinc-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex-shrink-0 size-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">HMS</span>
              </div>
              {!isCollapsed && (
                <span className="font-semibold text-zinc-900 text-sm whitespace-nowrap">
                  Hospital Management
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-zinc-200">
            {sections.map((section) => {
              const isExpanded = expandedSection === section.id;
              const hasActiveChild = section.items.some(item => location.pathname === item.path);

              return (
                <div key={section.id} className="mb-2 last:mb-0">
                  {!isCollapsed ? (
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-5 py-2 group transition-colors",
                        hasActiveChild ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                      )}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] leading-none">
                        {section.label}
                      </span>
                      <ChevronDown className={cn(
                        "size-3 transition-transform duration-200",
                        isExpanded ? "rotate-0" : "-rotate-90"
                      )} />
                    </button>
                  ) : (
                    <div className="border-t border-zinc-100 my-2 mx-3" />
                  )}

                  <div className={cn(
                    "space-y-0.5 overflow-hidden transition-all duration-300 ease-in-out",
                    isCollapsed || isExpanded ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"
                  )}>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={cn(
                            "group relative flex items-center transition-all duration-200 mx-2 py-2 rounded-lg",
                            isCollapsed ? "justify-center px-0" : "px-3",
                            isActive
                              ? "bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-900"
                              : "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900"
                          )}
                          title={isCollapsed ? item.label : undefined}
                        >
                          <Icon className={cn(
                            "size-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
                            isCollapsed ? "" : "mr-2.5",
                            isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-900"
                          )} />
                          {!isCollapsed && (
                            <span className="text-sm font-medium truncate tracking-tight">{item.label}</span>
                          )}
                          {isActive && !isCollapsed && (
                            <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-1 h-5 bg-zinc-900 rounded-r-full" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-3 border-t border-zinc-100 bg-zinc-50/50">
            <div className={cn(
              "flex items-center p-1",
              isCollapsed ? "justify-center" : "gap-3"
            )}>
              <div className="size-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-700 text-xs font-semibold flex-shrink-0 overflow-hidden ring-1 ring-zinc-200">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate capitalize">
                    {user?.roles?.[0]?.toLowerCase() || 'User'}
                  </p>
                </div>
              )}
              {!isCollapsed && (
                <button
                  onClick={handleLogout}
                  className="p-1 text-zinc-400 hover:text-zinc-900 transition-colors"
                  title="Logout"
                >
                  <LogOut className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 hidden lg:flex size-6 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 hover:text-zinc-600 shadow-sm z-50"
          >
            {isCollapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-zinc-900/20 backdrop-blur-[2px] z-30 lg:hidden"
        />
      )}
    </>
  );
}
