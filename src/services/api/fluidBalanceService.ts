import apiClient from './axios';

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

export interface UpdateFluidBalanceRequest extends CreateFluidBalanceRequest {}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const fluidBalanceService = {
  async getFluidBalanceById(id: string): Promise<FluidBalance> {
    const response = await apiClient.get(`/nursing/fluid-balance/${id}`);
    return response.data.data;
  },

  async getFluidBalanceByPatientId(patientId: string): Promise<FluidBalance[]> {
    const response = await apiClient.get(`/nursing/fluid-balance/patient/${patientId}`);
    return response.data.data;
  },

  async getFluidBalanceByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'recordDate', sortDirection = 'desc'): Promise<PaginatedResponse<FluidBalance>> {
    const response = await apiClient.get(`/nursing/fluid-balance/patient/${patientId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createFluidBalance(request: CreateFluidBalanceRequest): Promise<FluidBalance> {
    const response = await apiClient.post('/nursing/fluid-balance', request);
    return response.data.data;
  },

  async updateFluidBalance(id: string, request: UpdateFluidBalanceRequest): Promise<FluidBalance> {
    const response = await apiClient.put(`/nursing/fluid-balance/${id}`, request);
    return response.data.data;
  },

  async deleteFluidBalance(id: string): Promise<void> {
    await apiClient.delete(`/nursing/fluid-balance/${id}`);
  },

  async searchFluidBalance(searchTerm: string, page = 0, size = 10, sortBy = 'recordDate', sortDirection = 'desc'): Promise<PaginatedResponse<FluidBalance>> {
    const response = await apiClient.get('/nursing/fluid-balance/search', { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },
};
