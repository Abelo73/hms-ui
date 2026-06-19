import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LeaveRequest } from '@/services/api/hrService';

interface RejectionDialogProps {
  isOpen: boolean;
  leaveRequest: LeaveRequest | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function RejectionDialog({ isOpen, leaveRequest, onClose, onConfirm }: RejectionDialogProps) {
  const [reason, setReason] = useState('');

  if (!isOpen || !leaveRequest) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason.trim());
      setReason('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Reject Leave Request</h2>
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
              You are about to reject the leave request for employee <span className="font-semibold text-zinc-900">{leaveRequest.employeeId.slice(0, 8)}…</span>
            </p>
            <div className="text-xs text-zinc-500 space-y-1">
              <p><span className="font-medium">Leave Type:</span> {leaveRequest.leaveType}</p>
              <p><span className="font-medium">Dates:</span> {leaveRequest.startDate} to {leaveRequest.endDate}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Rejection Reason *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={3}
              placeholder="Provide a reason for rejecting this leave request..."
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
              Reject Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
