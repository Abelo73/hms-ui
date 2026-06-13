import axios from 'axios';
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const patientsService = {
  async getAllPatientsPaginated(
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Patient>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/patients`, {
      params: { page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getAllPatients(): Promise<Patient[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/patients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getPatientById(id: string): Promise<Patient> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/patients/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getPatientByMedicalRecordNumber(medicalRecordNumber: string): Promise<Patient> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/patients/mrn/${medicalRecordNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async searchPatientsPaginated(
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<Patient>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/patients/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async searchPatients(searchTerm: string): Promise<Patient[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/patients/search`, {
      params: { searchTerm },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async getPatientsByStatus(status: string): Promise<Patient[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/patients/status/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async createPatient(request: CreatePatientRequest): Promise<Patient> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/patients`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async updatePatient(id: string, request: UpdatePatientRequest): Promise<Patient> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/patients/${id}`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  async deletePatient(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/patients/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
