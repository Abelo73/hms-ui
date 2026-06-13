import apiClient from '../api/axios';
import { endpoints } from '@/config/api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post(endpoints.auth.login, credentials);
    return response.data.data;
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post(endpoints.auth.register, data);
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(endpoints.auth.logout);
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await apiClient.post(endpoints.auth.refreshToken, { refreshToken });
    return response.data.data;
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await apiClient.post(endpoints.auth.forgotPassword, data);
  },

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post(endpoints.auth.resetPassword, data);
  },
};
