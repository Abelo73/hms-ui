import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface FluidBalance {
  id: string;
  patientId: string;
  recordDate: string;
  shiftType: string;
  oralIntake: number;
  intravenousIntake: number;
  parenteralIntake: number;
  bloodProductIntake: number;
  otherIntake: number;
  totalIntake: number;
  urineOutput: number;
  stoolOutput: number;
  emesisOutput: number;
  drainageOutput: number;
  otherOutput: number;
  totalOutput: number;
  netBalance: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateFluidBalanceRequest {
  patientId: string;
  recordDate: string;
  shiftType: string;
  oralIntake: number;
  intravenousIntake: number;
  parenteralIntake: number;
  bloodProductIntake: number;
  otherIntake: number;
  urineOutput: number;
  stoolOutput: number;
  emesisOutput: number;
  drainageOutput: number;
  otherOutput: number;
  notes?: string;
}

export interface UpdateFluidBalanceRequest {
  recordDate: string;
  shiftType: string;
  oralIntake: number;
  intravenousIntake: number;
  parenteralIntake: number;
  bloodProductIntake: number;
  otherIntake: number;
  urineOutput: number;
  stoolOutput: number;
  emesisOutput: number;
  drainageOutput: number;
  otherOutput: number;
  notes?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const fluidBalanceService = {
  async getFluidBalanceById(id: string): Promise<FluidBalance> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/fluid-balance/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getFluidBalanceByPatientId(patientId: string): Promise<FluidBalance[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/fluid-balance/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getFluidBalanceByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'recordDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<FluidBalance>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/fluid-balance/patient/${patientId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getFluidBalanceByDateRange(
    startDate: string,
    endDate: string,
    page = 0,
    size = 10,
    sortBy = 'recordDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<FluidBalance>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/fluid-balance/date-range`, {
      params: { startDate, endDate, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async searchFluidBalance(
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'recordDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<FluidBalance>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/fluid-balance/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async createFluidBalance(request: CreateFluidBalanceRequest): Promise<FluidBalance> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/nursing/fluid-balance`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async updateFluidBalance(id: string, request: UpdateFluidBalanceRequest): Promise<FluidBalance> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/nursing/fluid-balance/${id}`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async deleteFluidBalance(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/nursing/fluid-balance/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
