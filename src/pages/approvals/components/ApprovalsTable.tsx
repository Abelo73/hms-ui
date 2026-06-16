import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  User as UserIcon,
  Calendar,
  ChevronRight
} from 'lucide-react';
import type { ApprovalRequest } from '@/services/api/approvalsService';

interface ApprovalsTableProps {
  approvals: ApprovalRequest[];
  onApprove: (request: ApprovalRequest) => void;
  onReject: (request: ApprovalRequest) => void;
  onViewDetails: (request: ApprovalRequest) => void;
}

export function ApprovalsTable({ approvals, onApprove, onReject, onViewDetails }: ApprovalsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-100 font-normal">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Wait Approval
          </Badge>
        );
      case 'PENDING_VERIFICATION':
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-100 font-normal">
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            Verification
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-normal">
            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
            Approved
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-100 font-normal">
            <XCircle className="w-3.5 h-3.5 mr-1.5" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full overflow-hidden border border-zinc-200 rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-200">
              <th className="px-4 py-3 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">Candidate</th>
              <th className="px-4 py-3 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">Requested Roles</th>
              <th className="px-4 py-3 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">Submission Date</th>
              <th className="px-4 py-3 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-[12px] font-medium text-zinc-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {approvals.map((approval) => (
              <tr key={approval.id} className="hover:bg-zinc-50/30 transition-colors group cursor-pointer" onClick={() => onViewDetails(approval)}>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-zinc-900 text-sm">
                        {approval.firstName} {approval.lastName}
                      </div>
                      <div className="text-zinc-500 text-xs mt-0.5">
                        {approval.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {approval.requestedRole && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-50 text-zinc-600 border border-zinc-200">
                        {approval.requestedRole}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center text-zinc-600 text-xs">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-60" />
                    {formatDate(approval.submittedAt)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(approval.status)}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-[11px] font-medium border-zinc-200 text-zinc-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all"
                      onClick={() => onApprove(approval)}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-[11px] font-medium border-zinc-200 text-zinc-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all"
                      onClick={() => onReject(approval)}
                    >
                      Reject
                    </Button>
                    <div className="w-8 h-8 rounded hover:bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-600">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
