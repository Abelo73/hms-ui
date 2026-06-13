import { useState, useEffect } from 'react';
import { Shield, Plus, Key, Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { rolesService, type Role } from '@/services/api/rolesService';
import { RolesTable } from './components/RolesTable';

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    loadRoles();
  }, [pagination.page]);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await rolesService.getAllRolesPaginated(pagination.page, pagination.size);
      setRoles(data.content || []);
      setPagination({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (error) {
      console.error('Failed to load roles:', error);
      toast.error('Failed to load roles and permissions');
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleSizeChange = (newSize: number) => {
    setPagination({ ...pagination, size: newSize, page: 0 });
  };

  return (
    <MainLayout
      pageTitle="Security Roles"
      pageAction={
        <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm">
          <Plus className="w-3.5 h-3.5 mr-2" />
          Create New Role
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Roles', value: roles.length, icon: Shield },
            { label: 'Total Permissions', value: roles.reduce((a, r) => a + (r.permissions?.length ?? 0), 0), icon: Key },
            { label: 'System Roles', value: roles.filter(r => ['ADMIN','DOCTOR','NURSE'].includes(r.name)).length, icon: Shield },
          ].map(chip => (
            <div key={chip.label} className="bg-white border border-zinc-200 rounded-lg p-4 flex items-center gap-3 shadow-sm">
              <chip.icon className="w-5 h-5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wide">{chip.label}</p>
                <p className="text-xl font-semibold text-zinc-900 leading-none mt-0.5">{chip.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Filter roles by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all shadow-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 px-4 bg-white border-zinc-200 text-zinc-600 shrink-0">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Advanced
          </Button>
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
              <span className="text-xs text-zinc-500 font-medium">Fetching security matrix...</span>
            </div>
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center text-center p-6">
            <Shield className="w-10 h-10 text-zinc-300 mb-4" />
            <h3 className="text-sm font-medium text-zinc-900">No roles defined</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-[240px]">
              Customize your security model by creating roles with specific permission sets.
            </p>
          </div>
        ) : (
          <RolesTable
            roles={filteredRoles}
            onEdit={() => toast.info('Role Permission Matrix coming soon')}
            onDelete={() => {}}
          />
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
            <div className="text-sm text-zinc-500">
              Showing {pagination.page * pagination.size + 1} to{' '}
              {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
              {pagination.totalElements}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="h-8 px-3"
              >
                Previous
              </Button>
              <span className="text-sm text-zinc-600">
                Page {pagination.page + 1} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
                className="h-8 px-3"
              >
                Next
              </Button>
              <select
                value={pagination.size}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                className="h-8 px-2 text-sm border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
              >
                <option value={2}>2 per page</option>
                <option value={5}>5 per page</option>
                <option value={7}>7 per page</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
