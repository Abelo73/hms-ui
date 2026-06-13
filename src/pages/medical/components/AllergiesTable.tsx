import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { Allergy } from '@/services/api/allergiesService';

interface AllergiesTableProps {
  allergies: Allergy[];
  onEdit: (allergy: Allergy) => void;
  onDelete: (allergy: Allergy) => void;
}

export function AllergiesTable({ allergies, onEdit, onDelete }: AllergiesTableProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50/50">
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Allergen</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Type</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Severity</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Reaction</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Onset Date</th>
            <th className="text-right px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allergies.map((allergy) => (
            <tr key={allergy.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-zinc-900">{allergy.allergenName}</p>
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className="bg-zinc-50 text-zinc-700 border-zinc-200">
                  {allergy.allergenType.replace(/_/g, ' ')}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant="outline"
                  className={`${
                    allergy.severity === 'MILD'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : allergy.severity === 'MODERATE'
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      : allergy.severity === 'SEVERE'
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {allergy.severity.replace(/_/g, ' ')}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-zinc-700">{allergy.reaction || '-'}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-zinc-700">{allergy.onsetDate || '-'}</p>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-zinc-100"
                    onClick={() => onEdit(allergy)}
                  >
                    <Edit className="w-4 h-4 text-zinc-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50"
                    onClick={() => onDelete(allergy)}
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
