import apiClient from './axios';

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
    const response = await apiClient.get(`/vaccinations/${id}`);
    return response.data.data;
  },

  async getVaccinationsByPatientId(patientId: string): Promise<Vaccination[]> {
    const response = await apiClient.get(`/vaccinations/patient/${patientId}`);
    return response.data.data;
  },

  async getVaccinationsByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'administrationDate', sortDirection = 'desc'): Promise<PaginatedResponse<Vaccination>> {
    const response = await apiClient.get(`/vaccinations/patient/${patientId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchPatientVaccinations(patientId: string, searchTerm: string, page = 0, size = 10, sortBy = 'administrationDate', sortDirection = 'desc'): Promise<PaginatedResponse<Vaccination>> {
    const response = await apiClient.get(`/vaccinations/patient/${patientId}/search`, { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createVaccination(request: CreateVaccinationRequest): Promise<Vaccination> {
    const response = await apiClient.post('/vaccinations', request);
    return response.data.data;
  },

  async updateVaccination(id: string, request: UpdateVaccinationRequest): Promise<Vaccination> {
    const response = await apiClient.put(`/vaccinations/${id}`, request);
    return response.data.data;
  },

  async deleteVaccination(id: string): Promise<void> {
    await apiClient.delete(`/vaccinations/${id}`);
  },
};
