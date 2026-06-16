import apiClient from './axios';

export interface Allergy {
  id: string;
  patientId: string;
  allergenType: string;
  allergenName: string;
  severity: string;
  reaction: string;
  onsetDate: string;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAllergyRequest {
  patientId: string;
  allergenType: string;
  allergenName: string;
  severity: string;
  reaction?: string;
  onsetDate?: string;
  reportedBy?: string;
}

export interface UpdateAllergyRequest {
  allergenType: string;
  allergenName: string;
  severity: string;
  reaction?: string;
  onsetDate?: string;
  reportedBy?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const allergiesService = {
  async getAllergyById(id: string): Promise<Allergy> {
    const response = await apiClient.get(`/allergies/${id}`);
    return response.data.data;
  },

  async getAllergiesByPatientId(patientId: string): Promise<Allergy[]> {
    const response = await apiClient.get(`/allergies/patient/${patientId}`);
    return response.data.data;
  },

  async getAllergiesByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'onsetDate', sortDirection = 'desc'): Promise<PaginatedResponse<Allergy>> {
    const response = await apiClient.get(`/allergies/patient/${patientId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchPatientAllergies(patientId: string, searchTerm: string, page = 0, size = 10, sortBy = 'onsetDate', sortDirection = 'desc'): Promise<PaginatedResponse<Allergy>> {
    const response = await apiClient.get(`/allergies/patient/${patientId}/search`, { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createAllergy(request: CreateAllergyRequest): Promise<Allergy> {
    const response = await apiClient.post('/allergies', request);
    return response.data.data;
  },

  async updateAllergy(id: string, request: UpdateAllergyRequest): Promise<Allergy> {
    const response = await apiClient.put(`/allergies/${id}`, request);
    return response.data.data;
  },

  async deleteAllergy(id: string): Promise<void> {
    await apiClient.delete(`/allergies/${id}`);
  },
};
