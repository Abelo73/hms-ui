import apiClient from './axios';

export interface IncidentReport {
  id: string;
  patientId: string;
  incidentType: string;
  incidentSeverity: string;
  incidentStatus: string;
  incidentDate: string;
  incidentTime: string;
  reportedBy: string;
  reportedDate: string;
  reportedTime: string;
  location: string;
  description: string;
  immediateAction?: string;
  witnesses?: string;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateIncidentReportRequest {
  patientId: string;
  incidentType: string;
  incidentSeverity: string;
  incidentStatus: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  description: string;
  immediateAction?: string;
  witnesses?: string;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  notes?: string;
}

export interface UpdateIncidentReportRequest extends CreateIncidentReportRequest {}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const incidentReportsService = {
  async getIncidentReportById(id: string): Promise<IncidentReport> {
    const response = await apiClient.get(`/nursing/incident-reports/${id}`);
    return response.data.data;
  },

  async getIncidentReportsByPatientId(patientId: string): Promise<IncidentReport[]> {
    const response = await apiClient.get(`/nursing/incident-reports/patient/${patientId}`);
    return response.data.data;
  },

  async getIncidentReportsByPatientIdPaginated(patientId: string, page = 0, size = 10, sortBy = 'incidentDate', sortDirection = 'desc'): Promise<PaginatedResponse<IncidentReport>> {
    const response = await apiClient.get(`/nursing/incident-reports/patient/${patientId}`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async getIncidentReportsByStatus(status: string, page = 0, size = 10, sortBy = 'incidentDate', sortDirection = 'desc'): Promise<PaginatedResponse<IncidentReport>> {
    const response = await apiClient.get(`/nursing/incident-reports/status/${status}`, { params: { page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async searchIncidentReports(searchTerm: string, page = 0, size = 10, sortBy = 'incidentDate', sortDirection = 'desc'): Promise<PaginatedResponse<IncidentReport>> {
    const response = await apiClient.get('/nursing/incident-reports/search', { params: { searchTerm, page, size, sortBy, sortDirection } });
    return response.data.data;
  },

  async createIncidentReport(request: CreateIncidentReportRequest): Promise<IncidentReport> {
    const response = await apiClient.post('/nursing/incident-reports', request);
    return response.data.data;
  },

  async updateIncidentReport(id: string, request: UpdateIncidentReportRequest): Promise<IncidentReport> {
    const response = await apiClient.put(`/nursing/incident-reports/${id}`, request);
    return response.data.data;
  },

  async deleteIncidentReport(id: string): Promise<void> {
    await apiClient.delete(`/nursing/incident-reports/${id}`);
  },
};
