import apiClient from './axios';

export interface NursingShift {
  id: string;
  nurseId: string;
  shiftDate: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  assignedUnit: string;
  status: string;
  patientCount: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateNursingShiftRequest {
  nurseId: string;
  shiftDate: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  assignedUnit: string;
  status: string;
  patientCount: number;
  notes?: string;
}

export interface UpdateNursingShiftRequest extends CreateNursingShiftRequest {}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const nursingShiftsService = {
  async getNursingShiftById(id: string): Promise<NursingShift> {
    const response = await apiClient.get(`/nursing/shifts/${id}`);
    return response.data.data;
  },

  async getNursingShiftsByNurseId(nurseId: string): Promise<NursingShift[]> {
    const response = await apiClient.get(`/nursing/shifts/nurse/${nurseId}`);
    return response.data.data;
  },

  async getNursingShiftsByNurseIdPaginated(nurseId: string, page = 0, size = 10, sortBy = 'shiftDate', sortDirection = 'desc'): Promise<PaginatedResponse<NursingShift>> {
    const response = await apiClient.get(`/nursing/shifts/nurse/${nurseId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async getNursingShiftsByStatus(status: string, page = 0, size = 10, sortBy = 'shiftDate', sortDirection = 'desc'): Promise<PaginatedResponse<NursingShift>> {
    const response = await apiClient.get(`/nursing/shifts/status/${status}`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchNursingShifts(searchTerm: string, page = 0, size = 10, sortBy = 'shiftDate', sortDirection = 'desc'): Promise<PaginatedResponse<NursingShift>> {
    const response = await apiClient.get('/nursing/shifts/search', { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createNursingShift(request: CreateNursingShiftRequest): Promise<NursingShift> {
    const response = await apiClient.post('/nursing/shifts', request);
    return response.data.data;
  },

  async updateNursingShift(id: string, request: UpdateNursingShiftRequest): Promise<NursingShift> {
    const response = await apiClient.put(`/nursing/shifts/${id}`, request);
    return response.data.data;
  },

  async deleteNursingShift(id: string): Promise<void> {
    await apiClient.delete(`/nursing/shifts/${id}`);
  },
};
