import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { Vaccination } from '@/services/api/vaccinationsService';

interface VaccinationsTableProps {
  vaccinations: Vaccination[];
  onEdit: (vaccination: Vaccination) => void;
  onDelete: (vaccination: Vaccination) => void;
}

export function VaccinationsTable({ vaccinations, onEdit, onDelete }: VaccinationsTableProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50/50">
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Vaccine</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Type</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Dose</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Lot Number</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Administered Date</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Next Due</th>
            <th className="text-right px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vaccinations.map((vaccination) => (
            <tr key={vaccination.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-zinc-900">{vaccination.vaccineName}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-zinc-700">{vaccination.vaccineType || '-'}</p>
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className="bg-zinc-50 text-zinc-700 border-zinc-200">
                  {vaccination.doseNumber ? `Dose ${vaccination.doseNumber}` : '-'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-zinc-700">{vaccination.lotNumber || '-'}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-zinc-700">{vaccination.administrationDate}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-zinc-700">{vaccination.nextDueDate || '-'}</p>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-zinc-100"
                    onClick={() => onEdit(vaccination)}
                  >
                    <Edit className="w-4 h-4 text-zinc-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50"
                    onClick={() => onDelete(vaccination)}
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
