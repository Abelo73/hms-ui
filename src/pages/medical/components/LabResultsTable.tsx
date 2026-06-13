import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { LabResult } from '@/services/api/labResultsService';
import { LabResultStatus } from '@/types/medical';

interface LabResultsTableProps {
  labResults: LabResult[];
  onEdit: (labResult: LabResult) => void;
  onDelete: (labResult: LabResult) => void;
}

export function LabResultsTable({ labResults, onEdit, onDelete }: LabResultsTableProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50/50">
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Test</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Type</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Result</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Reference Range</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Status</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Test Date</th>
            <th className="text-right px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {labResults.map((labResult) => (
            <tr key={labResult.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-zinc-900">{labResult.testName}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-zinc-700">{labResult.testType || '-'}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-zinc-900">{labResult.resultValue || '-'}</p>
                {labResult.unit && <p className="text-xs text-zinc-500">{labResult.unit}</p>}
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-zinc-700">{labResult.referenceRange || '-'}</p>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant="outline"
                  className={`${
                    labResult.status === LabResultStatus.NORMAL
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : labResult.status === LabResultStatus.ABNORMAL
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      : labResult.status === LabResultStatus.CRITICAL
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  {labResult.status.replace(/_/g, ' ')}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-zinc-700">{labResult.testDate}</p>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-zinc-100"
                    onClick={() => onEdit(labResult)}
                  >
                    <Edit className="w-4 h-4 text-zinc-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50"
                    onClick={() => onDelete(labResult)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
