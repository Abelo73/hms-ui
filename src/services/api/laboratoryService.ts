import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/laboratory/tests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async createRequest(request: CreateLabTestRequest): Promise<LabTestRequest> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/laboratory/requests`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getRequest(id: string): Promise<LabTestRequest> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/laboratory/requests/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getPatientRequests(patientId: string): Promise<LabTestRequest[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/laboratory/requests/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async updateItemResult(itemId: string, resultValue: string, flag: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.put(`${API_BASE_URL}/laboratory/items/${itemId}/result`, {
        resultValue,
        resultFlag: flag
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
};
