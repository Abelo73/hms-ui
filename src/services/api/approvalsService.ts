import apiClient from './axios';
import { endpoints } from '@/config/api';

export interface ApprovalRequest {
  id: string;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  requestType: string;
  requestedRole: string;
  status: string;
  submittedAt: string;
  documentsRequired: boolean;
  documentsVerified: boolean;
  rejectionReason?: string;
  requiresVerification?: boolean;
}

export interface ApprovalActionRequest {
  action: 'APPROVE' | 'REJECT';
  comments?: string;
}

export const approvalsService = {
  async getPendingApprovals(): Promise<ApprovalRequest[]> {
    const response = await apiClient.get(endpoints.approvals.pending);
    return response.data.data;
  },

  async getPendingApprovalsPaginated(page: number, size: number): Promise<any> {
    const response = await apiClient.get(endpoints.approvals.pending, {
      params: { page, size }
    });
    return response.data;
  },

  async getMyRequests(): Promise<ApprovalRequest[]> {
    const response = await apiClient.get(endpoints.approvals.my);
    return response.data.data;
  },

  async processRequest(id: string, action: ApprovalActionRequest): Promise<void> {
    await apiClient.post(`${endpoints.approvals.process}/${id}`, action);
  },

  async getVerificationDocuments(requestId: string): Promise<any[]> {
    const response = await apiClient.get(`${endpoints.approvals.base}/verification-documents/${requestId}`);
    return response.data.data;
  }
};
