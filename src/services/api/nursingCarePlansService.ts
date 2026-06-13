import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/care-plans/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getNursingCarePlansByPatientId(patientId: string): Promise<NursingCarePlan[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/care-plans/patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getNursingCarePlansByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'startDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingCarePlan>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/care-plans/patient/${patientId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getNursingCarePlansByType(
    planType: string,
    page = 0,
    size = 10,
    sortBy = 'startDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingCarePlan>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/care-plans/type/${planType}`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getNursingCarePlansByStatus(
    status: string,
    page = 0,
    size = 10,
    sortBy = 'startDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingCarePlan>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/care-plans/status/${status}`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async searchNursingCarePlans(
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'startDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingCarePlan>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/care-plans/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async createNursingCarePlan(request: CreateNursingCarePlanRequest): Promise<NursingCarePlan> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/nursing/care-plans`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async updateNursingCarePlan(id: string, request: UpdateNursingCarePlanRequest): Promise<NursingCarePlan> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/nursing/care-plans/${id}`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async deleteNursingCarePlan(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/nursing/care-plans/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
