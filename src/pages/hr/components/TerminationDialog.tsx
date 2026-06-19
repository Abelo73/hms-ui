import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Employee } from '@/services/api/hrService';

interface TerminationDialogProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onConfirm: (terminationDate: string, reason: string) => void;
}

export function TerminationDialog({ isOpen, employee, onClose, onConfirm }: TerminationDialogProps) {
  const [terminationDate, setTerminationDate] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen || !employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminationDate && reason) {
      onConfirm(terminationDate, reason);
      setTerminationDate('');
      setReason('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Terminate Employee</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <p className="text-sm text-zinc-600 mb-2">
              You are about to terminate <span className="font-semibold text-zinc-900">{employee.firstName} {employee.lastName}</span> ({employee.employeeNumber})
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Termination Date *
            </label>
            <input
              type="date"
              value={terminationDate}
              onChange={(e) => setTerminationDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Reason for Termination *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={3}
              placeholder="Provide a reason for termination..."
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-9 px-4 bg-red-600 hover:bg-red-700 text-white"
            >
              Terminate Employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
