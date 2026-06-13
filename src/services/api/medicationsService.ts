import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface Medication {
  id: string;
  patientId: string;
  medicationName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate: string;
  prescribingPhysicianId: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicationRequest {
  patientId: string;
  medicationName: string;
  genericName?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  startDate?: string;
  endDate?: string;
  prescribingPhysicianId?: string;
  status: string;
  notes?: string;
}

export interface UpdateMedicationRequest {
  medicationName: string;
  genericName?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  startDate?: string;
  endDate?: string;
  prescribingPhysicianId?: string;
  status: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const medicationsService = {
  async getMedicationById(id: string): Promise<Medication> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/medications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getMedicationsByPatientId(patientId: string): Promise<Medication[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/medications/patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getActiveMedicationsByPatientId(patientId: string): Promise<Medication[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/medications/patient/${patientId}/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getMedicationsByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'startDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Medication>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/medications/patient/${patientId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async searchPatientMedications(
    patientId: string,
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'startDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Medication>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/medications/patient/${patientId}/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async createMedication(request: CreateMedicationRequest): Promise<Medication> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/medications`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async updateMedication(id: string, request: UpdateMedicationRequest): Promise<Medication> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/medications/${id}`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async deleteMedication(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/medications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
