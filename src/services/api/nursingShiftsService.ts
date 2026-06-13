import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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

export interface UpdateNursingShiftRequest {
  shiftDate: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  assignedUnit: string;
  status: string;
  patientCount: number;
  notes?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const nursingShiftsService = {
  async getNursingShiftById(id: string): Promise<NursingShift> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/shifts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingShiftsByNurseId(nurseId: string): Promise<NursingShift[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/shifts/nurse/${nurseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingShiftsByNurseIdPaginated(
    nurseId: string,
    page = 0,
    size = 10,
    sortBy = 'shiftDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingShift>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/shifts/nurse/${nurseId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingShiftsByType(
    shiftType: string,
    page = 0,
    size = 10,
    sortBy = 'shiftDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingShift>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/shifts/type/${shiftType}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingShiftsByStatus(
    status: string,
    page = 0,
    size = 10,
    sortBy = 'shiftDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingShift>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/shifts/status/${status}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getNursingShiftsByDateRange(
    startDate: string,
    endDate: string,
    page = 0,
    size = 10,
    sortBy = 'shiftDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingShift>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/shifts/date-range`, {
      params: { startDate, endDate, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async searchNursingShifts(
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'shiftDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<NursingShift>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/shifts/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async createNursingShift(request: CreateNursingShiftRequest): Promise<NursingShift> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/nursing/shifts`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async updateNursingShift(id: string, request: UpdateNursingShiftRequest): Promise<NursingShift> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/nursing/shifts/${id}`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async deleteNursingShift(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/nursing/shifts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
