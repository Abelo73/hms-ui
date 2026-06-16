import apiClient from './axios';

export interface MedicationAdministration {
  id: string;
  patientId: string;
  admissionId?: string;
  medicationId?: string;
  // Support both naming conventions
  scheduledDate?: string;
  scheduledTime?: string;
  administrationDate?: string;
  administrationTime?: string;
  administeredDate?: string;
  administeredTime?: string;
  administeredBy?: string;
  verifiedBy?: string;
  dose?: string;
  dosage?: string;
  route?: string;
  medicationRoute?: string;
  site?: string;
  frequency?: string;
  administrationStatus?: string;
  status?: string;
  refusalReason?: string;
  holdReason?: string;
  adverseReaction?: string;
  effectiveness?: string;
  notes?: string;
  barcodeScanned?: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateMedicationAdministrationRequest {
  patientId: string;
  admissionId?: string;
  medicationId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  administrationDate?: string;
  administrationTime?: string;
  administeredDate?: string;
  administeredTime?: string;
  administeredBy?: string;
  verifiedBy?: string;
  dose?: string;
  dosage?: string;
  route?: string;
  medicationRoute?: string;
  site?: string;
  frequency?: string;
  administrationStatus?: string;
  status?: string;
  refusalReason?: string;
  holdReason?: string;
  adverseReaction?: string;
  effectiveness?: string;
  notes?: string;
  barcodeScanned?: boolean;
}

export interface UpdateMedicationAdministrationRequest extends CreateMedicationAdministrationRequest {}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const medicationAdministrationsService = {
  async getMedicationAdministrationById(id: string): Promise<MedicationAdministration> {
    const response = await apiClient.get(`/nursing/medication-administrations/${id}`);
    return response.data.data;
  },

  async getMedicationAdministrationsByPatientId(patientId: string): Promise<MedicationAdministration[]> {
    const response = await apiClient.get(`/nursing/medication-administrations/patient/${patientId}`);
    return response.data.data;
  },

  async getMedicationAdministrationsByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'administrationDate', sortDirection = 'desc'): Promise<PaginatedResponse<MedicationAdministration>> {
    const response = await apiClient.get(`/nursing/medication-administrations/patient/${patientId}/paginated`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async getMedicationAdministrationsByStatus(status: string, page = 0, size = 10, sortBy = 'administrationDate', sortDirection = 'desc'): Promise<PaginatedResponse<MedicationAdministration>> {
    const response = await apiClient.get(`/nursing/medication-administrations/status/${status}`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createMedicationAdministration(request: CreateMedicationAdministrationRequest): Promise<MedicationAdministration> {
    const response = await apiClient.post('/nursing/medication-administrations', request);
    return response.data.data;
  },

  async updateMedicationAdministration(id: string, request: UpdateMedicationAdministrationRequest): Promise<MedicationAdministration> {
    const response = await apiClient.put(`/nursing/medication-administrations/${id}`, request);
    return response.data.data;
  },

  async deleteMedicationAdministration(id: string): Promise<void> {
    await apiClient.delete(`/nursing/medication-administrations/${id}`);
  },

  async searchMedicationAdministrations(searchTerm: string, page = 0, size = 10, sortBy = 'administrationDate', sortDirection = 'desc'): Promise<PaginatedResponse<MedicationAdministration>> {
    const response = await apiClient.get('/nursing/medication-administrations/search', { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },
};
