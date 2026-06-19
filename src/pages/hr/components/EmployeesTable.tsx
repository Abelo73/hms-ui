import { MoreHorizontal, Pencil, UserX } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Employee } from '@/services/api/hrService';

interface EmployeesTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onTerminate: (employee: Employee) => void;
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  INACTIVE: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  ON_LEAVE: 'bg-amber-50 text-amber-700 border-amber-200',
  TERMINATED: 'bg-red-50 text-red-700 border-red-200',
  PROBATION: 'bg-blue-50 text-blue-700 border-blue-200',
};

export function EmployeesTable({ employees, onEdit, onTerminate }: EmployeesTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50/70">
            <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Employee</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Department</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Position</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Type</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Hire Date</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-zinc-50/50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-700 text-xs font-semibold flex-shrink-0">
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-zinc-400">{emp.employeeNumber} · {emp.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-zinc-600">{emp.department || '—'}</td>
              <td className="px-4 py-3 text-zinc-600">{emp.position || '—'}</td>
              <td className="px-4 py-3 text-zinc-500 text-xs capitalize">{emp.employeeType?.replace(/_/g, ' ') || '—'}</td>
              <td className="px-4 py-3 text-zinc-500 text-xs">{emp.hireDate || '—'}</td>
              <td className="px-4 py-3">
                {emp.status ? (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[emp.status] || 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
                    {emp.status.replace(/_/g, ' ')}
                  </span>
                ) : '—'}
              </td>
              <td className="px-4 py-3 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setOpenMenu(openMenu === emp.id ? null : emp.id)}
                >
                  <MoreHorizontal className="size-4 text-zinc-400" />
                </Button>
                {openMenu === emp.id && (
                  <div className="absolute right-4 top-10 z-10 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                    <button
                      onClick={() => { onEdit(emp); setOpenMenu(null); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                    >
                      <Pencil className="size-3.5" /> Edit
                    </button>
                    {emp.status !== 'TERMINATED' && (
                      <button
                        onClick={() => { onTerminate(emp); setOpenMenu(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <UserX className="size-3.5" /> Terminate
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
