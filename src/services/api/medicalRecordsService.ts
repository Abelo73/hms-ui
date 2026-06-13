import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/medical-records/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getMedicalRecordsByPatientId(patientId: string): Promise<MedicalRecord[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/medical-records/patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getMedicalRecordsByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'recordDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<MedicalRecord>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/medical-records/patient/${patientId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async searchPatientMedicalRecords(
    patientId: string,
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'recordDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<MedicalRecord>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/medical-records/patient/${patientId}/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async createMedicalRecord(request: CreateMedicalRecordRequest): Promise<MedicalRecord> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/medical-records`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async updateMedicalRecord(id: string, request: UpdateMedicalRecordRequest): Promise<MedicalRecord> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/medical-records/${id}`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async deleteMedicalRecord(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/medical-records/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
