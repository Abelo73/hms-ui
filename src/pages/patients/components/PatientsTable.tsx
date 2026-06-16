import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import type { Patient } from '@/services/api/patientsService';

interface PatientsTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  onView: (patient: Patient) => void;
  onStatusChange: (patient: Patient) => void;
}

export function PatientsTable({ patients, onEdit, onDelete, onView }: PatientsTableProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50/50">
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Patient</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">MRN</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Contact</th>
            <th className="text-left px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Status</th>
            <th className="text-right px-4 py-3 text-[12px] font-semibold text-zinc-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 text-xs font-semibold">
                    {patient.firstName[0]}{patient.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{patient.firstName} {patient.lastName}</p>
                    <p className="text-xs text-zinc-500">{patient.dateOfBirth}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm font-mono text-zinc-700">{patient.medicalRecordNumber}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm text-zinc-700">{patient.phoneNumber || '-'}</p>
                <p className="text-xs text-zinc-500">{patient.email || '-'}</p>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant="outline"
                  className={`${
                    patient.status === 'ACTIVE'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : patient.status === 'INACTIVE'
                      ? 'bg-gray-50 text-gray-700 border-gray-200'
                      : patient.status === 'ADMITTED'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                  }`}
                >
                  {patient.status.replace(/_/g, ' ')}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-zinc-100"
                    onClick={() => onView(patient)}
                  >
                    <Eye className="w-4 h-4 text-zinc-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-zinc-100"
                    onClick={() => onEdit(patient)}
                  >
                    <Edit className="w-4 h-4 text-zinc-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50"
                    onClick={() => onDelete(patient)}
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
