import { Shield, MoreHorizontal, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Role } from '@/services/api/rolesService';

interface RolesTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RolesTable({ roles, onEdit }: RolesTableProps) {
  return (
    <div className="w-full overflow-hidden border border-zinc-200 rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-200">
              <th className="px-4 py-3 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">Role Name</th>
              <th className="px-4 py-3 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">Permissions</th>
              <th className="px-4 py-3 text-[12px] font-medium text-zinc-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-zinc-50/30 transition-colors group">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center text-white">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-zinc-900 text-sm">{role.name}</div>
                      <div className="text-zinc-500 text-[11px] mt-0.5">System Identifier: {role.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-zinc-600 text-sm max-w-[300px] truncate">{role.description || 'No description provided'}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 font-normal hover:bg-zinc-100">
                      <Key className="w-3 h-3 mr-1.5 opacity-60" />
                      {role.permissions?.length || 0} Permissions
                    </Badge>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity-all duration-200">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                      onClick={() => onEdit(role)}
                    >
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
