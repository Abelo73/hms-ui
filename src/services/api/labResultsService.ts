import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface LabResult {
  id: string;
  patientId: string;
  testType: string;
  testName: string;
  testDate: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  status: string;
  performedBy: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabResultRequest {
  patientId: string;
  testType?: string;
  testName: string;
  testDate: string;
  resultValue?: string;
  unit?: string;
  referenceRange?: string;
  status: string;
  performedBy?: string;
  notes?: string;
}

export interface UpdateLabResultRequest {
  testType?: string;
  testName: string;
  testDate: string;
  resultValue?: string;
  unit?: string;
  referenceRange?: string;
  status: string;
  performedBy?: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const labResultsService = {
  async getLabResultById(id: string): Promise<LabResult> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/lab-results/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getLabResultsByPatientId(patientId: string): Promise<LabResult[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/lab-results/patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getLabResultsByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'testDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<LabResult>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/lab-results/patient/${patientId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async searchPatientLabResults(
    patientId: string,
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'testDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<LabResult>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/lab-results/patient/${patientId}/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async createLabResult(request: CreateLabResultRequest): Promise<LabResult> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/lab-results`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async updateLabResult(id: string, request: UpdateLabResultRequest): Promise<LabResult> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/lab-results/${id}`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async deleteLabResult(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/lab-results/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
