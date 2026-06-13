import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Search, Plus, SlidersHorizontal, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { usersService, type User } from '@/services/api/usersService';
import { UsersTable } from './components/UsersTable';
import { UserDetailDrawer } from './components/UserDetailDrawer';
import { CreateUserDialog } from './components/CreateUserDialog';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    loadUsers();
  }, [pagination.page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await usersService.getAllUsersPaginated(pagination.page, pagination.size);
      
      // Handle both paginated (has content/totalElements) and non-paginated (direct array) responses
      if (Array.isArray(result)) {
        setUsers(result);
        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil(result.length / prev.size),
          totalElements: result.length,
        }));
      } else {
        setUsers(result.content || []);
        setPagination({
          page: result.number ?? 0,
          size: result.size ?? pagination.size,
          totalPages: result.totalPages ?? 0,
          totalElements: result.totalElements ?? 0,
        });
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) return;
    try {
      await usersService.deleteUser(user.id);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedUser(null);
    loadUsers();
  };

  const handleStatusChange = async (user: User, newStatus: string) => {
    try {
      await usersService.updateUser(user.id, { approvalStatus: newStatus });
      toast.success('User status updated successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleSizeChange = (newSize: number) => {
    setPagination({ ...pagination, size: newSize, page: 0 });
  };

  return (
    <MainLayout
      pageTitle="Staff Directory"
      pageAction={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 px-3 text-zinc-600 border-zinc-200">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
            Filters
          </Button>
          <Button size="sm" className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-2" />
            Add Staff
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 transition-colors group-focus-within:text-zinc-600" />
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all shadow-sm"
          />
        </div>

        {loading ? (
          <div className="w-full h-48 border border-zinc-200 rounded-lg bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
              <span className="text-xs text-zinc-500 font-medium">Loading staff registry...</span>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="w-full h-64 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-zinc-900">No staff members found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-[240px]">
              Try adjusting your search or filters to find the users you're looking for.
            </p>
            <Button variant="outline" size="sm" className="mt-4 h-8 px-3" onClick={() => setSearchTerm('')}>
              Reset search
            </Button>
          </div>
        ) : (
          <>
            <div className="text-[12px] font-medium text-zinc-500 uppercase tracking-wider px-1">
              Registry ({filteredUsers.length} total)
            </div>
            <UsersTable
              users={filteredUsers}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          </>
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

      <UserDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        user={selectedUser}
      />

      <CreateUserDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={loadUsers}
      />
    </MainLayout>
  );
}
