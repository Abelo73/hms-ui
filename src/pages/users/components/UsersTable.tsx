import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Shield,
  Mail,
  CheckCircle2,
  Clock,
  FileCheck,
  XCircle,
  AlertCircle } from 'lucide-react';
import type { User } from '@/services/api/usersService';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onStatusChange: (user: User, newStatus: string) => void;
}

export function UsersTable({ users, onEdit }: UsersTableProps) {
  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 font-normal">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Approved
          </Badge>
        );
      case 'PENDING_APPROVAL':
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50 font-normal">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Pending Approval
          </Badge>
        );
      case 'PENDING_VERIFICATION':
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50 font-normal">
            <FileCheck className="w-3.5 h-3.5 mr-1.5" />
            Verification
          </Badge>
        );
      case 'PENDING_SUBMISSION':
        return (
          <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-100 font-normal">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Pending Submission
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-50 font-normal">
            <XCircle className="w-3.5 h-3.5 mr-1.5" />
            Rejected
          </Badge>
        );
      case 'SUSPENDED':
        return (
          <Badge className="bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-50 font-normal">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="w-full overflow-hidden border border-zinc-200 rounded-lg bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-bottom border-zinc-200">
              <th className="px-4 py-3 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">Roles</th>
              <th className="px-4 py-3 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">Account</th>
              <th className="px-4 py-3 text-[12px] font-medium text-zinc-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-50/30 transition-colors group">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 font-medium text-sm">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-zinc-900 text-sm">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-zinc-500 text-xs flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {user.roles.map((role) => (
                      <div key={role} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                        <Shield className="w-3 h-3 mr-1 opacity-70" />
                        {role}
                      </div>
                    ))}
                    {user.roles.length === 0 && <span className="text-zinc-400 text-xs italic">No roles</span>}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {getApprovalBadge(user.approvalStatus)}
                </td>
                <td className="px-4 py-4">
                  <Badge variant={user.enabled ? 'default' : 'secondary'} className={`font-normal text-[11px] ${user.enabled ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
                    {user.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900" onClick={() => onEdit(user)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
