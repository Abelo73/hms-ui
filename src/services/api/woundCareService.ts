import apiClient from './axios';

export interface WoundCare {
  id: string;
  patientId: string;
  woundType: string;
  woundLocation: string;
  woundStage?: string;
  woundSize: string;
  exudateType?: string;
  exudateAmount?: string;
  odorLevel?: string;
  healingProgress: string;
  treatment: string;
  assessmentDate: string;
  assessmentTime: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateWoundCareRequest {
  patientId: string;
  woundType: string;
  woundLocation: string;
  woundStage?: string;
  woundSize: string;
  exudateType?: string;
  exudateAmount?: string;
  odorLevel?: string;
  healingProgress: string;
  treatment: string;
  assessmentDate: string;
  assessmentTime: string;
  notes?: string;
}

export interface UpdateWoundCareRequest extends CreateWoundCareRequest {}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const woundCareService = {
  async getWoundCareById(id: string): Promise<WoundCare> {
    const response = await apiClient.get(`/nursing/wound-care/${id}`);
    return response.data.data;
  },

  async getWoundCareByPatientId(patientId: string): Promise<WoundCare[]> {
    const response = await apiClient.get(`/nursing/wound-care/patient/${patientId}`);
    return response.data.data;
  },

  async getWoundCareByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'assessmentDate', sortDirection = 'desc'): Promise<PaginatedResponse<WoundCare>> {
    const response = await apiClient.get(`/nursing/wound-care/patient/${patientId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchWoundCare(searchTerm: string, page = 0, size = 10, sortBy = 'assessmentDate', sortDirection = 'desc'): Promise<PaginatedResponse<WoundCare>> {
    const response = await apiClient.get('/nursing/wound-care/search', { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createWoundCare(request: CreateWoundCareRequest): Promise<WoundCare> {
    const response = await apiClient.post('/nursing/wound-care', request);
    return response.data.data;
  },

  async updateWoundCare(id: string, request: UpdateWoundCareRequest): Promise<WoundCare> {
    const response = await apiClient.put(`/nursing/wound-care/${id}`, request);
    return response.data.data;
  },

  async deleteWoundCare(id: string): Promise<void> {
    await apiClient.delete(`/nursing/wound-care/${id}`);
  },
};
