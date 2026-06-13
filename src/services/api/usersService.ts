import apiClient from './axios';
import { endpoints } from '@/config/api';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles: string[];
  enabled: boolean;
  approvalStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles?: string[];
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  enabled?: boolean;
  approvalStatus?: string;
  roles?: string[];
}

export const usersService = {
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get(endpoints.users.base);
    return response.data.data;
  },

  async getAllUsersPaginated(page: number, size: number): Promise<any> {
    const response = await apiClient.get(endpoints.users.base, {
      params: { page, size }
    });
    return response.data.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`${endpoints.users.base}/${id}`);
    return response.data.data;
  },

  async createUser(user: CreateUserRequest): Promise<User> {
    const response = await apiClient.post(endpoints.users.base, user);
    return response.data.data;
  },

  async updateUser(id: string, user: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put(`${endpoints.users.base}/${id}`, user);
    return response.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${endpoints.users.base}/${id}`);
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get(endpoints.users.me);
    return response.data.data;
  },

  async getUsersByRole(roleName: string): Promise<User[]> {
    const response = await apiClient.get(`${endpoints.users.base}/role/${roleName}`);
    return response.data.data;
  },

  async searchUsersByRole(roleName: string, searchTerm: string): Promise<User[]> {
    const response = await apiClient.get(`${endpoints.users.base}/role/${roleName}/search`, {
      params: { searchTerm }
    });
    return response.data.data;
  }
};
