import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { usersService, type User } from '@/services/api/usersService';
import {
  Shield,
  Mail,
  Phone,
  Calendar,
  Lock,
  XCircle,
  Key,
  Users as UsersIcon,
  Stethoscope,
  Settings,
  Plus,
  Trash2
} from 'lucide-react';

interface UserDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const API_PERMISSIONS = {
  PATIENT: {
    icon: <UsersIcon className="w-4 h-4" />,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    endpoints: [
      { method: 'GET', path: '/api/patients', description: 'View all patients' },
      { method: 'POST', path: '/api/patients', description: 'Create new patient' },
      { method: 'PUT', path: '/api/patients/{id}', description: 'Update patient' },
      { method: 'DELETE', path: '/api/patients/{id}', description: 'Delete patient' },
    ]
  },
  APPOINTMENT: {
    icon: <Calendar className="w-4 h-4" />,
    color: 'bg-green-50 text-green-700 border-green-200',
    endpoints: [
      { method: 'GET', path: '/api/appointments', description: 'View appointments' },
      { method: 'POST', path: '/api/appointments', description: 'Create appointment' },
      { method: 'PUT', path: '/api/appointments/{id}', description: 'Update appointment' },
      { method: 'DELETE', path: '/api/appointments/{id}', description: 'Delete appointment' },
    ]
  },
  USER: {
    icon: <Shield className="w-4 h-4" />,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    endpoints: [
      { method: 'GET', path: '/api/users', description: 'View users' },
      { method: 'POST', path: '/api/users', description: 'Create user' },
      { method: 'PUT', path: '/api/users/{id}', description: 'Update user' },
      { method: 'DELETE', path: '/api/users/{id}', description: 'Delete user' },
    ]
  },
  MEDICAL: {
    icon: <Stethoscope className="w-4 h-4" />,
    color: 'bg-red-50 text-red-700 border-red-200',
    endpoints: [
      { method: 'GET', path: '/api/medical-records', description: 'View medical records' },
      { method: 'POST', path: '/api/medical-records', description: 'Create medical record' },
      { method: 'PUT', path: '/api/medical-records/{id}', description: 'Update medical record' },
    ]
  },
  SYSTEM: {
    icon: <Settings className="w-4 h-4" />,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    endpoints: [
      { method: 'GET', path: '/api/settings', description: 'View system settings' },
      { method: 'PUT', path: '/api/settings', description: 'Update system settings' },
    ]
  }
};

const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: ['PATIENT', 'APPOINTMENT', 'USER', 'MEDICAL', 'SYSTEM'],
  DOCTOR: ['PATIENT', 'APPOINTMENT', 'MEDICAL'],
  NURSE: ['PATIENT', 'APPOINTMENT', 'MEDICAL'],
  RECEPTIONIST: ['PATIENT', 'APPOINTMENT'],
  BILLING_STAFF: ['PATIENT'] };

const ALL_ROLES = ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'BILLING_STAFF'];

export function UserDetailDrawer({ isOpen, onClose, user }: UserDetailDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'activity'>('overview');
  const [localUser, setLocalUser] = useState<User | null>(null);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  if (!user) return null;

  const currentUser = localUser || user;
  const userPermissions = currentUser.roles.flatMap(role => ROLE_PERMISSIONS[role] || []);
  const uniquePermissions = [...new Set(userPermissions)];

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      const updatedUser = await usersService.updateUser(currentUser.id, { enabled: !currentUser.enabled });
      setLocalUser(updatedUser);
      toast.success(`User ${currentUser.enabled ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (role: string) => {
    setLoading(true);
    try {
      const currentRoles = currentUser.roles || [];
      const newRoles = currentRoles.includes(role)
        ? currentRoles.filter(r => r !== role)
        : [...currentRoles, role];

      const updatedUser = await usersService.updateUser(currentUser.id, { roles: newRoles });
      setLocalUser(updatedUser);
      toast.success(`Role ${role} ${currentRoles.includes(role) ? 'removed' : 'assigned'} successfully`);
    } catch (error) {
      toast.error('Failed to update user roles');
    } finally {
      setLoading(false);
    }
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-green-100 text-green-700',
      POST: 'bg-blue-100 text-blue-700',
      PUT: 'bg-yellow-100 text-yellow-700',
      DELETE: 'bg-red-100 text-red-700' };
    return colors[method] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>User Details</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XCircle className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* User Header */}
          <div className="flex items-start gap-4 pb-6 border-b border-zinc-200">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {currentUser.firstName[0]}{currentUser.lastName[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-zinc-900">
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {currentUser.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={currentUser.enabled ? 'default' : 'secondary'} className={currentUser.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {currentUser.enabled ? 'Active' : 'Inactive'}
                </Badge>
                <Badge className="bg-zinc-100 text-zinc-700">
                  @{currentUser.username}
                </Badge>
              </div>
            </div>
            <Button
              variant={currentUser.enabled ? 'destructive' : 'default'}
              size="sm"
              onClick={handleToggleStatus}
              disabled={loading}
            >
              {currentUser.enabled ? 'Disable' : 'Enable'}
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-zinc-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'permissions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Permissions
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'activity'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Activity
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Roles
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentUser.roles.map((role) => (
                    <Badge key={role} className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                      {role}
                    </Badge>
                  ))}
                  {currentUser.roles.length === 0 && (
                    <p className="text-sm text-zinc-500 italic">No roles assigned</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {ALL_ROLES.map((role) => (
                    <Button
                      key={role}
                      type="button"
                      variant={currentUser.roles.includes(role) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleRoleToggle(role)}
                      disabled={loading}
                      className={currentUser.roles.includes(role) ? 'bg-zinc-900' : ''}
                    >
                      {currentUser.roles.includes(role) ? (
                        <Trash2 className="w-3 h-3 mr-1" />
                      ) : (
                        <Plus className="w-3 h-3 mr-1" />
                      )}
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 rounded-lg p-4">
                  <p className="text-xs text-zinc-500 mb-1">Phone</p>
                  <p className="text-sm font-medium text-zinc-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    {currentUser.phoneNumber || 'Not provided'}
                  </p>
                </div>
                <div className="bg-zinc-50 rounded-lg p-4">
                  <p className="text-xs text-zinc-500 mb-1">Account Created</p>
                  <p className="text-sm font-medium text-zinc-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  API Access Control
                </h3>
                <p className="text-xs text-blue-700">
                  This user has access to the following API endpoints based on their roles.
                </p>
              </div>

              {uniquePermissions.length === 0 ? (
                <div className="text-center py-8 bg-zinc-50 rounded-lg">
                  <Lock className="w-12 h-12 text-zinc-300 mx-auto mb-2" />
                  <p className="text-sm text-zinc-500">No API permissions assigned</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uniquePermissions.map((permission) => {
                    const config = API_PERMISSIONS[permission as keyof typeof API_PERMISSIONS];
                    if (!config) return null;

                    return (
                      <div key={permission} className="border border-zinc-200 rounded-lg overflow-hidden">
                        <div className={`flex items-center gap-2 px-4 py-3 ${config.color}`}>
                          {config.icon}
                          <span className="font-semibold">{permission}</span>
                        </div>
                        <div className="p-4 bg-white">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-zinc-500 text-xs">
                                <th className="pb-2">Method</th>
                                <th className="pb-2">Endpoint</th>
                                <th className="pb-2">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                              {config.endpoints.map((endpoint, idx) => (
                                <tr key={idx}>
                                  <td className="py-2">
                                    <Badge className={getMethodBadge(endpoint.method)} variant="outline">
                                      {endpoint.method}
                                    </Badge>
                                  </td>
                                  <td className="py-2 font-mono text-xs text-zinc-600">{endpoint.path}</td>
                                  <td className="py-2 text-zinc-700">{endpoint.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="text-center py-8 bg-zinc-50 rounded-lg">
              <Calendar className="w-12 h-12 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm text-zinc-500">Activity log coming soon</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
