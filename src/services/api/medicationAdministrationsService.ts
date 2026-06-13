import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface MedicationAdministration {
  id: string;
  patientId: string;
  admissionId?: string;
  medicationId?: string;
  scheduledDate: string;
  scheduledTime: string;
  administeredDate?: string;
  administeredTime?: string;
  administeredBy?: string;
  verifiedBy?: string;
  dose?: string;
  route?: string;
  site?: string;
  administrationStatus: string;
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
  scheduledDate: string;
  scheduledTime: string;
  administeredDate?: string;
  administeredTime?: string;
  administeredBy?: string;
  verifiedBy?: string;
  dose?: string;
  route?: string;
  site?: string;
  administrationStatus: string;
  refusalReason?: string;
  holdReason?: string;
  adverseReaction?: string;
  effectiveness?: string;
  notes?: string;
  barcodeScanned?: boolean;
}

export interface UpdateMedicationAdministrationRequest {
  admissionId?: string;
  medicationId?: string;
  scheduledDate: string;
  scheduledTime: string;
  administeredDate?: string;
  administeredTime?: string;
  administeredBy?: string;
  verifiedBy?: string;
  dose?: string;
  route?: string;
  site?: string;
  administrationStatus: string;
  refusalReason?: string;
  holdReason?: string;
  adverseReaction?: string;
  effectiveness?: string;
  notes?: string;
  barcodeScanned?: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const medicationAdministrationsService = {
  async getMedicationAdministrationById(id: string): Promise<MedicationAdministration> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/medication-administrations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getMedicationAdministrationsByPatientId(patientId: string): Promise<MedicationAdministration[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/medication-administrations/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getMedicationAdministrationsByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'administrationDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<MedicationAdministration>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/medication-administrations/patient/${patientId}/paginated`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getMedicationAdministrationsByStatus(
    status: string,
    page = 0,
    size = 10,
    sortBy = 'administrationDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<MedicationAdministration>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/medication-administrations/status/${status}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getMedicationAdministrationsByDateRange(
    startDate: string,
    endDate: string,
    page = 0,
    size = 10,
    sortBy = 'administrationDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<MedicationAdministration>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/medication-administrations/date-range`, {
      params: { startDate, endDate, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async searchMedicationAdministrations(
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'administrationDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<MedicationAdministration>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/medication-administrations/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async createMedicationAdministration(request: CreateMedicationAdministrationRequest): Promise<MedicationAdministration> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/nursing/medication-administrations`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async updateMedicationAdministration(id: string, request: UpdateMedicationAdministrationRequest): Promise<MedicationAdministration> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/nursing/medication-administrations/${id}`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async deleteMedicationAdministration(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/nursing/medication-administrations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
