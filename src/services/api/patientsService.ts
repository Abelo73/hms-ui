import apiClient from './axios';
import type { Patient, CreatePatientRequest, UpdatePatientRequest } from '@/types/patient';

export type { Patient, CreatePatientRequest, UpdatePatientRequest };

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const patientsService = {
  async getAllPatientsPaginated(page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc'): Promise<PaginatedResponse<Patient>> {
    const response = await apiClient.get('/patients', { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async getAllPatients(): Promise<Patient[]> {
    const response = await apiClient.get('/patients');
    return response.data.data;
  },

  async getPatientById(id: string): Promise<Patient> {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data.data;
  },

  async getPatientByMedicalRecordNumber(medicalRecordNumber: string): Promise<Patient> {
    const response = await apiClient.get(`/patients/mrn/${medicalRecordNumber}`);
    return response.data.data;
  },

  async searchPatientsPaginated(searchTerm: string, page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc'): Promise<PaginatedResponse<Patient>> {
    const response = await apiClient.get('/patients/search', { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchPatients(searchTerm: string): Promise<Patient[]> {
    const response = await apiClient.get('/patients/search', { params: { searchTerm } });
    return response.data.data;
  },

  async getPatientsByStatus(status: string): Promise<Patient[]> {
    const response = await apiClient.get(`/patients/status/${status}`);
    return response.data.data;
  },

  async createPatient(request: CreatePatientRequest): Promise<Patient> {
    const response = await apiClient.post('/patients', request);
    return response.data.data;
  },

  async updatePatient(id: string, request: UpdatePatientRequest): Promise<Patient> {
    const response = await apiClient.put(`/patients/${id}`, request);
    return response.data.data;
  },

  async deletePatient(id: string): Promise<void> {
    await apiClient.delete(`/patients/${id}`);
  },
};
