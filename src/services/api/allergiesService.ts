import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/allergies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getAllergiesByPatientId(patientId: string): Promise<Allergy[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/allergies/patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getAllergiesByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'onsetDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Allergy>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/allergies/patient/${patientId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async searchPatientAllergies(
    patientId: string,
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'onsetDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Allergy>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/allergies/patient/${patientId}/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async createAllergy(request: CreateAllergyRequest): Promise<Allergy> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/allergies`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async updateAllergy(id: string, request: UpdateAllergyRequest): Promise<Allergy> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/allergies/${id}`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async deleteAllergy(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/allergies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
