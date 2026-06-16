import apiClient from './axios';

export interface MedicalRecord {
  id: string;
  patientId: string;
  recordType: string;
  recordDate: string;
  title: string;
  description: string;
  clinicalNotes: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateMedicalRecordRequest {
  patientId: string;
  recordType: string;
  recordDate: string;
  title: string;
  description?: string;
  clinicalNotes?: string;
  status: string;
}

export interface UpdateMedicalRecordRequest {
  recordType: string;
  recordDate: string;
  title: string;
  description?: string;
  clinicalNotes?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const medicalRecordsService = {
  async getMedicalRecordById(id: string): Promise<MedicalRecord> {
    const response = await apiClient.get(`/medical-records/${id}`);
    return response.data.data;
  },

  async getMedicalRecordsByPatientId(patientId: string): Promise<MedicalRecord[]> {
    const response = await apiClient.get(`/medical-records/patient/${patientId}`);
    return response.data.data;
  },

  async getMedicalRecordsByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'recordDate', sortDirection = 'desc'): Promise<PaginatedResponse<MedicalRecord>> {
    const response = await apiClient.get(`/medical-records/patient/${patientId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchPatientMedicalRecords(patientId: string, searchTerm: string, page = 0, size = 10, sortBy = 'recordDate', sortDirection = 'desc'): Promise<PaginatedResponse<MedicalRecord>> {
    const response = await apiClient.get(`/medical-records/patient/${patientId}/search`, { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createMedicalRecord(request: CreateMedicalRecordRequest): Promise<MedicalRecord> {
    const response = await apiClient.post('/medical-records', request);
    return response.data.data;
  },

  async updateMedicalRecord(id: string, request: UpdateMedicalRecordRequest): Promise<MedicalRecord> {
    const response = await apiClient.put(`/medical-records/${id}`, request);
    return response.data.data;
  },

  async deleteMedicalRecord(id: string): Promise<void> {
    await apiClient.delete(`/medical-records/${id}`);
  },
};
