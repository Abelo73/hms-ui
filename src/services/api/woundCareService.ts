import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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

export interface UpdateWoundCareRequest {
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

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const woundCareService = {
  async getWoundCareById(id: string): Promise<WoundCare> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/wound-care/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getWoundCareByPatientId(patientId: string): Promise<WoundCare[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/wound-care/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getWoundCareByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'assessmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<WoundCare>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/wound-care/patient/${patientId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getWoundCareByType(
    woundType: string,
    page = 0,
    size = 10,
    sortBy = 'assessmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<WoundCare>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/wound-care/type/${woundType}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getWoundCareByHealingProgress(
    healingProgress: string,
    page = 0,
    size = 10,
    sortBy = 'assessmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<WoundCare>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/wound-care/healing-progress/${healingProgress}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async searchWoundCare(
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'assessmentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<WoundCare>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/wound-care/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async createWoundCare(request: CreateWoundCareRequest): Promise<WoundCare> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/nursing/wound-care`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async updateWoundCare(id: string, request: UpdateWoundCareRequest): Promise<WoundCare> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/nursing/wound-care/${id}`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async deleteWoundCare(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/nursing/wound-care/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
