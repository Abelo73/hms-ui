import apiClient from './axios';

export interface LabTest {
  id: string;
  testCode: string;
  testName: string;
  testCategory: string;
  specimenType: string;
  unit?: string;
  price?: number;
}

export interface LabTestRequestItem {
  id: string;
  testId: string;
  testName: string;
  status: 'PENDING' | 'SPECIMEN_COLLECTED' | 'RECEIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  resultValue?: string;
  resultFlag?: 'NORMAL' | 'ABNORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  unit?: string;
  referenceRange?: string;
}

export interface LabTestRequest {
  id: string;
  requestNumber: string;
  patientId: string;
  patientName: string;
  orderingProviderId: string;
  orderingProviderName: string;
  requestDate: string;
  requestTime: string;
  priority: 'ROUTINE' | 'URGENT' | 'STAT';
  status: string;
  clinicalInformation?: string;
  items: LabTestRequestItem[];
}

export interface CreateLabTestRequest {
  patientId: string;
  orderingProviderId: string;
  priority: 'ROUTINE' | 'URGENT' | 'STAT';
  clinicalInformation?: string;
  testIds: string[];
}

export const laboratoryService = {
  async getAllTests(): Promise<LabTest[]> {
    const response = await apiClient.get('/laboratory/tests');
    return response.data.data ?? response.data;
  },

  async createRequest(request: CreateLabTestRequest): Promise<LabTestRequest> {
    const response = await apiClient.post('/laboratory/requests', request);
    return response.data.data ?? response.data;
  },

  async getRequest(id: string): Promise<LabTestRequest> {
    const response = await apiClient.get(`/laboratory/requests/${id}`);
    return response.data.data ?? response.data;
  },

  async getPendingRequests(): Promise<LabTestRequest[]> {
    const response = await apiClient.get('/laboratory/requests/pending');
    const result = response.data.data ?? response.data;
    return Array.isArray(result) ? result : [];
  },

  async getPatientRequests(patientId: string): Promise<LabTestRequest[]> {
    const response = await apiClient.get(`/laboratory/requests/patient/${patientId}`);
    return response.data.data ?? response.data;
  },

  async updateItemResult(itemId: string, resultValue: string, flag: string): Promise<void> {
    await apiClient.put(`/laboratory/items/${itemId}/result`, { resultValue, resultFlag: flag });
  },
};
