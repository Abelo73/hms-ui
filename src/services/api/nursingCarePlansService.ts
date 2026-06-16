import apiClient from './axios';

export interface NursingCarePlan {
  id: string;
  admissionId: string;
  planName: string;
  planType: string;
  startDate: string;
  endDate?: string;
  goals: string;
  interventions: string;
  evaluation: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateNursingCarePlanRequest {
  patientId: string;
  admissionId?: string;
  planName: string;
  planType: string;
  startDate: string;
  endDate?: string;
  goals: string;
  interventions: string;
  evaluation?: string;
  status: string;
  primaryNurseId?: string;
  assessment?: string;
  nursingDiagnosis?: string;
}

export interface UpdateNursingCarePlanRequest {
  planName: string;
  planType: string;
  startDate: string;
  endDate?: string;
  goals: string;
  interventions: string;
  evaluation?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const nursingCarePlansService = {
  async getNursingCarePlanById(id: string): Promise<NursingCarePlan> {
    const response = await apiClient.get(`/nursing/care-plans/${id}`);
    return response.data.data;
  },

  async getNursingCarePlansByPatientId(patientId: string): Promise<NursingCarePlan[]> {
    const response = await apiClient.get(`/nursing/care-plans/patient/${patientId}`);
    return response.data.data;
  },

  async getNursingCarePlansByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'startDate', sortDirection = 'desc'): Promise<PaginatedResponse<NursingCarePlan>> {
    const response = await apiClient.get(`/nursing/care-plans/patient/${patientId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async getNursingCarePlansByStatus(status: string, page = 0, size = 10, sortBy = 'startDate', sortDirection = 'desc'): Promise<PaginatedResponse<NursingCarePlan>> {
    const response = await apiClient.get(`/nursing/care-plans/status/${status}`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchNursingCarePlans(searchTerm: string, page = 0, size = 10, sortBy = 'startDate', sortDirection = 'desc'): Promise<PaginatedResponse<NursingCarePlan>> {
    const response = await apiClient.get('/nursing/care-plans/search', { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createNursingCarePlan(request: CreateNursingCarePlanRequest): Promise<NursingCarePlan> {
    const response = await apiClient.post('/nursing/care-plans', request);
    return response.data.data;
  },

  async updateNursingCarePlan(id: string, request: UpdateNursingCarePlanRequest): Promise<NursingCarePlan> {
    const response = await apiClient.put(`/nursing/care-plans/${id}`, request);
    return response.data.data;
  },

  async deleteNursingCarePlan(id: string): Promise<void> {
    await apiClient.delete(`/nursing/care-plans/${id}`);
  },
};
