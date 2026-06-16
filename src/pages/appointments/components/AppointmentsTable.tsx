import { type Appointment } from '@/services/api/appointmentsService';
import { MoreVertical, Video, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppointmentsTableProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

export function AppointmentsTable({
  appointments,
  onEdit,
  getStatusColor,
  getPriorityColor }: AppointmentsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };


  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-zinc-200 rounded-lg">
        <Calendar className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-500">No appointments found</p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-zinc-50 border-b border-zinc-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Reason
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Location
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="hover:bg-zinc-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <div>
                    <div className="text-sm font-medium text-zinc-900">
                      {formatDate(appointment.appointmentDate)}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-zinc-700">
                  {appointment.appointmentType.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="px-4 py-3">
                {appointment.priority && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(appointment.priority)}`}>
                    {appointment.priority}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-zinc-700 max-w-xs truncate">
                  {appointment.reason || '-'}
                </div>
                {appointment.symptoms && (
                  <div className="text-xs text-zinc-500 truncate max-w-xs">
                    {appointment.symptoms}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-zinc-700">
                  {appointment.durationMinutes} min
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  {appointment.isVirtual ? (
                    <>
                      <Video className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-blue-600">Virtual</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs text-zinc-600">In-Person</span>
                    </>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(appointment)}>
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
