import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MedicalRecord } from '@/services/api/medicalRecordsService';

interface MedicalRecordsTableProps {
  medicalRecords: MedicalRecord[];
  loading: boolean;
  onEdit: (record: MedicalRecord) => void;
  onDelete: (id: string) => void;
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
  onPageChange: (page: number) => void;
}

export function MedicalRecordsTable({
  medicalRecords,
  loading,
  onEdit,
  onDelete,
  pagination,
  onPageChange }: MedicalRecordsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'INACTIVE':
        return 'bg-zinc-50 text-zinc-700 border-zinc-200';
      case 'ARCHIVED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
        </div>
      ) : medicalRecords.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-600">No medical records found</p>
        </div>
      ) : (
        <>
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50">
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Record Date</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicalRecords.map((record) => (
                <tr key={record.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-zinc-900">{record.title}</p>
                    {record.description && (
                      <p className="text-xs text-zinc-500 mt-1 truncate max-w-xs">{record.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="bg-zinc-50 text-zinc-700 border-zinc-200">
                      {record.recordType.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-zinc-700">{record.recordDate}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={getStatusColor(record.status)}>
                      {record.status.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-zinc-100"
                        onClick={() => onEdit(record)}
                      >
                        <Edit className="w-4 h-4 text-zinc-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-50"
                        onClick={() => onDelete(record.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 bg-zinc-50/50">
              <p className="text-sm text-zinc-600">
                Showing {pagination.page * pagination.size + 1} to{' '}
                {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} records
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 0}
                  className="h-8 px-3"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-zinc-600">
                  Page {pagination.page + 1} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages - 1}
                  className="h-8 px-3"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
