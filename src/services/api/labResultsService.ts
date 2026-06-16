import apiClient from './axios';

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
    const response = await apiClient.get(`/lab-results/${id}`);
    return response.data.data;
  },

  async getLabResultsByPatientId(patientId: string): Promise<LabResult[]> {
    const response = await apiClient.get(`/lab-results/patient/${patientId}`);
    return response.data.data;
  },

  async getLabResultsByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'testDate', sortDirection = 'desc'): Promise<PaginatedResponse<LabResult>> {
    const response = await apiClient.get(`/lab-results/patient/${patientId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchPatientLabResults(patientId: string, searchTerm: string, page = 0, size = 10, sortBy = 'testDate', sortDirection = 'desc'): Promise<PaginatedResponse<LabResult>> {
    const response = await apiClient.get(`/lab-results/patient/${patientId}/search`, { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createLabResult(request: CreateLabResultRequest): Promise<LabResult> {
    const response = await apiClient.post('/lab-results', request);
    return response.data.data;
  },

  async updateLabResult(id: string, request: UpdateLabResultRequest): Promise<LabResult> {
    const response = await apiClient.put(`/lab-results/${id}`, request);
    return response.data.data;
  },

  async deleteLabResult(id: string): Promise<void> {
    await apiClient.delete(`/lab-results/${id}`);
  },
};
