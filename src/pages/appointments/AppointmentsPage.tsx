import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, Calendar, List, User, X, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { appointmentsService, type Appointment, type PaginatedResponse } from '@/services/api/appointmentsService';
import { AppointmentsTable } from './components/AppointmentsTable';
import { AppointmentCalendarView } from './components/AppointmentCalendarView';
import { AppointmentFormDialog } from './components/AppointmentFormDialog';
import { appointmentStatuses, appointmentTypes, priorities } from '@/services/mock/appointmentsMockData';

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [userRole, setUserRole] = useState<string>('general'); // Will be fetched from auth context
  const [searchTerm, setSearchTerm] = useState('');
  const [roleSelectorOpen, setRoleSelectorOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0 });

  useEffect(() => {
    loadAppointments();
  }, [pagination.page, statusFilter, typeFilter, priorityFilter, userRole]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      let data: PaginatedResponse<Appointment>;
      
      // Role-based filtering
      if (userRole === 'doctor') {
        // Doctors see their own appointments
        const doctorId = localStorage.getItem('doctorId'); // Would come from auth context
        if (doctorId) {
          if (statusFilter) {
            data = await appointmentsService.getAppointmentsByDoctorIdAndStatus(
              doctorId,
              statusFilter as any,
              pagination.page,
              pagination.size
            );
          } else {
            data = await appointmentsService.getAppointmentsByDoctorIdPaginated(
              doctorId,
              pagination.page,
              pagination.size
            );
          }
        } else {
          setAppointments([]);
          setPagination({ page: 0, size: 5, totalPages: 0, totalElements: 0 });
          return;
        }
      } else if (userRole === 'nurse') {
        // Nurses see all appointments but can't edit
        data = await appointmentsService.searchAppointments(
          searchTerm || '',
          pagination.page,
          pagination.size
        );
      } else {
        // Show all appointments for general view
        data = await appointmentsService.searchAppointments(
          searchTerm || '',
          pagination.page,
          pagination.size
        );
      }
      
      setAppointments(data.content || []);
      setPagination({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements });
    } catch (error) {
      console.error('Failed to load appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAppointment(null);
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
    setPriorityFilter('');
  };


  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
      NO_SHOW: 'bg-orange-100 text-orange-800',
      RESCHEDULED: 'bg-purple-100 text-purple-800' };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      URGENT: 'bg-red-100 text-red-800' };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout
      pageTitle="Appointments Management"
      pageAction={
        <div className="flex items-center gap-2 overflow-visible">
          <div className="flex items-center gap-3">
            {/* Modern Role Selector */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRoleSelectorOpen(!roleSelectorOpen)}
                className="h-10 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300"
              >
                <User className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium text-blue-900">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
              </Button>
              {roleSelectorOpen && (
                <div className="absolute z-50 mt-2 w-48 bg-white rounded-lg shadow-xl border border-zinc-200 overflow-hidden">
                  <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-zinc-200">
                    <p className="text-xs font-semibold text-blue-900">View as Role</p>
                  </div>
                  {['general', 'doctor', 'nurse', 'receptionist'].map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setUserRole(role);
                        setRoleSelectorOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-50 transition-colors ${
                        userRole === role ? 'bg-blue-50 text-blue-900 font-medium' : 'text-zinc-700'
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modern Search */}
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.length >= 2) {
                    loadAppointments();
                  }
                }}
                placeholder="Search appointments..."
                className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    loadAppointments();
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <>
            <div className="flex items-center bg-zinc-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                onClick={() => setViewMode('calendar')}
                className="h-8 px-3"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8 px-4"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button size="sm" className="h-8 px-4 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm" onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </>
        </div>
      }
    >
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {showFilters && (
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                    >
                      <option value="">All Statuses</option>
                      {appointmentStatuses.map((status) => (
                        <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                    >
                      <option value="">All Types</option>
                      {appointmentTypes.map((type) => (
                        <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Priority</label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
                    >
                      <option value="">All Priorities</option>
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {(statusFilter || typeFilter || priorityFilter) && (
                  <div className="mt-3">
                    <Button variant="outline" size="sm" onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}

            {viewMode === 'calendar' ? (
              <AppointmentCalendarView
                appointments={appointments}
                onEdit={handleEdit}
              />
            ) : (
              <>
                <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">
                  Appointments ({pagination.totalElements} total)
                </div>
                <AppointmentsTable
                  appointments={appointments}
                  onEdit={handleEdit}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                />
              </>
            )}
          </>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
            <div className="text-sm text-zinc-500">
              Showing {pagination.page * pagination.size + 1} to{' '}
              {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
              {pagination.totalElements}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-zinc-600">
                Page {pagination.page + 1} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <AppointmentFormDialog
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={loadAppointments}
        editingAppointment={editingAppointment}
        patientId={userRole === 'doctor' ? localStorage.getItem('doctorId') : null}
      />
    </MainLayout>
  );
}
