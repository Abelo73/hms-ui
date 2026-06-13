import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { Medication } from '@/services/api/medicationsService';
import { MedicationStatus } from '@/types/medical';

interface MedicationsTableProps {
  medications: Medication[];
  onEdit: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
}

export function MedicationsTable({ medications, onEdit, onDelete }: MedicationsTableProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50/50">
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Medication</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Dosage</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Frequency</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Route</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Status</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Date Range</th>
            <th className="text-right px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medications.map((medication) => (
            <tr key={medication.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-zinc-900">{medication.medicationName}</p>
                {medication.genericName && (
                  <p className="text-xs text-zinc-500">{medication.genericName}</p>
                )}
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-zinc-700">{medication.dosage || '-'}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-zinc-700">{medication.frequency || '-'}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-zinc-700">{medication.route?.replace(/_/g, ' ') || '-'}</p>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant="outline"
                  className={`${
                    medication.status === MedicationStatus.ACTIVE
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : medication.status === MedicationStatus.DISCONTINUED
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : medication.status === MedicationStatus.COMPLETED
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}
                >
                  {medication.status.replace(/_/g, ' ')}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-zinc-700">
                  {medication.startDate || '-'} {medication.endDate ? `to ${medication.endDate}` : ''}
                </p>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-zinc-100"
                    onClick={() => onEdit(medication)}
                  >
                    <Edit className="w-4 h-4 text-zinc-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50"
                    onClick={() => onDelete(medication)}
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
