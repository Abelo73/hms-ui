import apiClient from './axios';

export interface Medication {
  id: string;
  patientId: string;
  medicationName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate: string;
  prescribingPhysicianId: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicationRequest {
  patientId: string;
  medicationName: string;
  genericName?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  startDate?: string;
  endDate?: string;
  prescribingPhysicianId?: string;
  status: string;
  notes?: string;
}

export interface UpdateMedicationRequest {
  medicationName: string;
  genericName?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  startDate?: string;
  endDate?: string;
  prescribingPhysicianId?: string;
  status: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const medicationsService = {
  async getMedicationById(id: string): Promise<Medication> {
    const response = await apiClient.get(`/medications/${id}`);
    return response.data.data;
  },

  async getMedicationsByPatientId(patientId: string): Promise<Medication[]> {
    const response = await apiClient.get(`/medications/patient/${patientId}`);
    return response.data.data;
  },

  async getActiveMedicationsByPatientId(patientId: string): Promise<Medication[]> {
    const response = await apiClient.get(`/medications/patient/${patientId}/active`);
    return response.data.data;
  },

  async getMedicationsByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'startDate', sortDirection = 'desc'): Promise<PaginatedResponse<Medication>> {
    const response = await apiClient.get(`/medications/patient/${patientId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchPatientMedications(patientId: string, searchTerm: string, page = 0, size = 10, sortBy = 'startDate', sortDirection = 'desc'): Promise<PaginatedResponse<Medication>> {
    const response = await apiClient.get(`/medications/patient/${patientId}/search`, { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createMedication(request: CreateMedicationRequest): Promise<Medication> {
    const response = await apiClient.post('/medications', request);
    return response.data.data;
  },

  async updateMedication(id: string, request: UpdateMedicationRequest): Promise<Medication> {
    const response = await apiClient.put(`/medications/${id}`, request);
    return response.data.data;
  },

  async deleteMedication(id: string): Promise<void> {
    await apiClient.delete(`/medications/${id}`);
  },
};
