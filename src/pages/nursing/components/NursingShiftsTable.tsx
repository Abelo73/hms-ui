import type { NursingShift } from '@/services/api/nursingShiftsService';

interface NursingShiftsTableProps {
  shifts: NursingShift[];
  loading: boolean;
  onEdit: (shift: NursingShift) => void;
  onDelete: (id: string) => void;
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
  onPageChange: (page: number) => void;
}

export function NursingShiftsTable({
  shifts,
  loading,
  onEdit,
  onDelete,
  pagination,
  onPageChange }: NursingShiftsTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (shifts.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-50 rounded-lg border border-zinc-200">
        <p className="text-zinc-600">No nursing shifts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-zinc-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Shift Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Shift Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Patient Count
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-200">
            {shifts.map((shift) => (
              <tr key={shift.id} className="hover:bg-zinc-50">
                <td className="px-4 py-4 text-sm text-zinc-600">{shift.shiftDate}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                    {shift.shiftType}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-zinc-600">
                  {shift.startTime} - {shift.endTime}
                </td>
                <td className="px-4 py-4 text-sm text-zinc-600">{shift.assignedUnit}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      shift.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : shift.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : shift.status === 'SCHEDULED'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {shift.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-zinc-600">{shift.patientCount}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(shift)}
                      className="text-zinc-600 hover:text-zinc-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(shift.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-600">
            Showing {pagination.page * pagination.size + 1} to{' '}
            {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
            {pagination.totalElements} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="px-3 py-1 text-sm border border-zinc-200 rounded hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-zinc-600">
              Page {pagination.page + 1} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1}
              className="px-3 py-1 text-sm border border-zinc-200 rounded hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
