import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface Vaccination {
  id: string;
  patientId: string;
  vaccineName: string;
  vaccineType: string;
  administrationDate: string;
  doseNumber: number;
  lotNumber: string;
  administeringProviderId: string;
  nextDueDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVaccinationRequest {
  patientId: string;
  vaccineName: string;
  vaccineType?: string;
  administrationDate: string;
  doseNumber?: number;
  lotNumber?: string;
  administeringProviderId?: string;
  nextDueDate?: string;
  notes?: string;
}

export interface UpdateVaccinationRequest {
  vaccineName: string;
  vaccineType?: string;
  administrationDate: string;
  doseNumber?: number;
  lotNumber?: string;
  administeringProviderId?: string;
  nextDueDate?: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const vaccinationsService = {
  async getVaccinationById(id: string): Promise<Vaccination> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/vaccinations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getVaccinationsByPatientId(patientId: string): Promise<Vaccination[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/vaccinations/patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getVaccinationsByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'administrationDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Vaccination>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/vaccinations/patient/${patientId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async searchPatientVaccinations(
    patientId: string,
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'administrationDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Vaccination>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/vaccinations/patient/${patientId}/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async createVaccination(request: CreateVaccinationRequest): Promise<Vaccination> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/vaccinations`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async updateVaccination(id: string, request: UpdateVaccinationRequest): Promise<Vaccination> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/vaccinations/${id}`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async deleteVaccination(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/vaccinations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
