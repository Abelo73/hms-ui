import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LeaveRequest } from '@/services/api/hrService';

interface LeaveRequestsTableProps {
  requests: LeaveRequest[];
  onApprove: (req: LeaveRequest) => void;
  onReject: (req: LeaveRequest) => void;
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  APPROVED:  { label: 'Approved',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REJECTED:  { label: 'Rejected',  cls: 'bg-red-50 text-red-700 border-red-200' },
  CANCELLED: { label: 'Cancelled', cls: 'bg-zinc-100 text-zinc-500 border-zinc-200' },
};

const leaveTypeLabel = (t: string) => t.replace(/_/g, ' ');

export function LeaveRequestsTable({ requests, onApprove, onReject }: LeaveRequestsTableProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50/70">
            <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Employee ID</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Leave Type</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Duration</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Days</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Reason</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {requests.map((req) => {
            const sc = statusConfig[req.status] ?? { label: req.status, cls: 'bg-zinc-100 text-zinc-600 border-zinc-200' };
            return (
              <tr key={req.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-zinc-500">{req.employeeId.slice(0, 8)}…</span>
                </td>
                <td className="px-4 py-3 font-medium text-zinc-800">{leaveTypeLabel(req.leaveType)}</td>
                <td className="px-4 py-3 text-zinc-600 text-xs">
                  {req.startDate} → {req.endDate}
                </td>
                <td className="px-4 py-3 text-zinc-600">{req.totalDays ?? '—'}</td>
                <td className="px-4 py-3 text-zinc-500 max-w-[180px] truncate">{req.reason || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${sc.cls}`}>
                    {req.status === 'PENDING' && <Clock className="size-3" />}
                    {req.status === 'APPROVED' && <CheckCircle className="size-3" />}
                    {req.status === 'REJECTED' && <XCircle className="size-3" />}
                    {sc.label}
                  </span>
                  {req.status === 'REJECTED' && req.rejectionReason && (
                    <p className="text-xs text-red-500 mt-0.5 max-w-[160px] truncate">{req.rejectionReason}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {req.status === 'PENDING' && (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                        onClick={() => onApprove(req)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2.5 border-red-200 text-red-600 hover:bg-red-50 text-xs"
                        onClick={() => onReject(req)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
