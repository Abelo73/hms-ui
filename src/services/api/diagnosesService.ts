import apiClient from './axios';

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
    const response = await apiClient.get(`/diagnoses/${id}`);
    return response.data.data;
  },

  async getDiagnosesByMedicalRecordId(medicalRecordId: string): Promise<Diagnosis[]> {
    const response = await apiClient.get(`/diagnoses/medical-record/${medicalRecordId}`);
    return response.data.data;
  },

  async getDiagnosesByMedicalRecordIdPaginated(medicalRecordId: string, page = 0, size = 10, sortBy = 'diagnosisDate', sortDirection = 'desc'): Promise<PaginatedResponse<Diagnosis>> {
    const response = await apiClient.get(`/diagnoses/medical-record/${medicalRecordId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchMedicalRecordDiagnoses(medicalRecordId: string, searchTerm: string, page = 0, size = 10, sortBy = 'diagnosisDate', sortDirection = 'desc'): Promise<PaginatedResponse<Diagnosis>> {
    const response = await apiClient.get(`/diagnoses/medical-record/${medicalRecordId}/search`, { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createDiagnosis(request: CreateDiagnosisRequest): Promise<Diagnosis> {
    const response = await apiClient.post('/diagnoses', request);
    return response.data.data;
  },

  async updateDiagnosis(id: string, request: UpdateDiagnosisRequest): Promise<Diagnosis> {
    const response = await apiClient.put(`/diagnoses/${id}`, request);
    return response.data.data;
  },

  async deleteDiagnosis(id: string): Promise<void> {
    await apiClient.delete(`/diagnoses/${id}`);
  },
};
