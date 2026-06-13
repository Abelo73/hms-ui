import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface Diagnosis {
  id: string;
  medicalRecordId: string;
  icd10Code: string;
  diagnosisName: string;
  diagnosisType: string;
  conditionStatus: string;
  diagnosisDate: string;
  resolvedDate: string;
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateDiagnosisRequest {
  medicalRecordId: string;
  icd10Code?: string;
  diagnosisName: string;
  diagnosisType: string;
  conditionStatus: string;
  diagnosisDate: string;
  resolvedDate?: string;
  notes?: string;
}

export interface UpdateDiagnosisRequest {
  icd10Code?: string;
  diagnosisName: string;
  diagnosisType: string;
  conditionStatus: string;
  diagnosisDate: string;
  resolvedDate?: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const diagnosesService = {
  async getDiagnosisById(id: string): Promise<Diagnosis> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/diagnoses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getDiagnosesByMedicalRecordId(medicalRecordId: string): Promise<Diagnosis[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/diagnoses/medical-record/${medicalRecordId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getDiagnosesByMedicalRecordIdPaginated(
    medicalRecordId: string,
    page = 0,
    size = 10,
    sortBy = 'diagnosisDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Diagnosis>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/diagnoses/medical-record/${medicalRecordId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async searchMedicalRecordDiagnoses(
    medicalRecordId: string,
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'diagnosisDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Diagnosis>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/diagnoses/medical-record/${medicalRecordId}/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async createDiagnosis(request: CreateDiagnosisRequest): Promise<Diagnosis> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/diagnoses`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async updateDiagnosis(id: string, request: UpdateDiagnosisRequest): Promise<Diagnosis> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/diagnoses/${id}`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async deleteDiagnosis(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/diagnoses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
