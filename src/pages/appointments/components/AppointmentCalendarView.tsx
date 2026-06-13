import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Appointment } from '@/services/api/appointmentsService';

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-800 border border-blue-300',
    CONFIRMED: 'bg-green-100 text-green-800 border border-green-300',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    COMPLETED: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    CANCELLED: 'bg-red-100 text-red-800 border border-red-300',
    NO_SHOW: 'bg-gray-100 text-gray-800 border border-gray-300',
    RESCHEDULED: 'bg-orange-100 text-orange-800 border border-orange-300',
  };
  return colors[status] || 'bg-purple-100 text-purple-800 border border-purple-300';
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    LOW: 'bg-green-50 text-green-700 border-l-2 border-green-500',
    MEDIUM: 'bg-yellow-50 text-yellow-700 border-l-2 border-yellow-500',
    HIGH: 'bg-orange-50 text-orange-700 border-l-2 border-orange-500',
    URGENT: 'bg-red-50 text-red-700 border-l-2 border-red-500',
  };
  return colors[priority] || 'bg-gray-50 text-gray-700 border-l-2 border-gray-500';
};

interface AppointmentCalendarViewProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
}

export function AppointmentCalendarView({
  appointments,
  onEdit,
}: AppointmentCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.appointmentDate === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-zinc-900">{monthName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="hover:bg-blue-50 hover:border-blue-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="hover:bg-blue-50 hover:border-blue-300"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="hover:bg-blue-50 hover:border-blue-300"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-zinc-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-32 bg-zinc-50 rounded-lg" />;
            }

            const dayAppointments = getAppointmentsForDate(date);
            const isToday = date.getTime() === today.getTime();
            const isPast = date < today;

            return (
              <div
                key={index}
                className={`h-32 p-2 rounded-lg border transition-all hover:shadow-md ${
                  isToday
                    ? 'bg-blue-50 border-blue-300'
                    : isPast
                    ? 'bg-zinc-50 border-zinc-200'
                    : 'bg-white border-zinc-200 hover:border-blue-300'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-zinc-700'}`}>
                  {date.getDate()}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-24">
                  {dayAppointments.slice(0, 3).map(apt => (
                    <div
                      key={apt.id}
                      onClick={() => onEdit(apt)}
                      className={`text-xs p-1.5 rounded cursor-pointer transition-all hover:scale-105 ${getStatusColor(apt.status)}`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="font-medium truncate">{formatTime(apt.startTime)}</span>
                        {apt.priority && (
                          <span className={`px-1 rounded text-[10px] font-semibold ${getPriorityColor(apt.priority)}`}>
                            {apt.priority[0]}
                          </span>
                        )}
                      </div>
                      <div className="truncate opacity-90">{apt.reason || 'No reason'}</div>
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-zinc-500 text-center py-1">
                      +{dayAppointments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointment Stats */}
      <div className="grid grid-cols-4 gap-4 p-6 bg-zinc-50 border-t border-zinc-200">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm font-medium text-zinc-600">Scheduled</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900">
            {appointments.filter(a => a.status === 'SCHEDULED').length}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm font-medium text-zinc-600">In Progress</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900">
            {appointments.filter(a => a.status === 'IN_PROGRESS').length}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-zinc-600">Completed</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900">
            {appointments.filter(a => a.status === 'COMPLETED').length}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-zinc-600">Cancelled</span>
          </div>
          <div className="text-2xl font-bold text-zinc-900">
            {appointments.filter(a => a.status === 'CANCELLED').length}
          </div>
        </div>
      </div>
    </div>
  );
}
