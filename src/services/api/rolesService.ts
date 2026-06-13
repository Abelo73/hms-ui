import apiClient from './axios';
import { endpoints } from '@/config/api';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export const rolesService = {
  async getAllRoles(): Promise<Role[]> {
    const response = await apiClient.get(endpoints.roles.base);
    return response.data.data;
  },

  async getAllRolesPaginated(page: number, size: number): Promise<any> {
    const response = await apiClient.get(endpoints.roles.base, {
      params: { page, size }
    });
    return response.data;
  },

  async getRoleById(id: string): Promise<Role> {
    const response = await apiClient.get(`${endpoints.roles.base}/${id}`);
    return response.data.data;
  },

  async createRole(role: Partial<Role>): Promise<Role> {
    const response = await apiClient.post(endpoints.roles.base, role);
    return response.data.data;
  },

  async updateRole(id: string, role: Partial<Role>): Promise<Role> {
    const response = await apiClient.put(`${endpoints.roles.base}/${id}`, role);
    return response.data.data;
  },

  async deleteRole(id: string): Promise<void> {
    await apiClient.delete(`${endpoints.roles.base}/${id}`);
  },

  async getAllPermissions(): Promise<Permission[]> {
    const response = await apiClient.get(endpoints.permissions.base);
    return response.data.data;
  }
};
