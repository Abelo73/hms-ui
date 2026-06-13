import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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

export interface UpdateIncidentReportRequest {
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

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const incidentReportsService = {
  async getIncidentReportById(id: string): Promise<IncidentReport> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/incident-reports/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getIncidentReportsByPatientId(patientId: string): Promise<IncidentReport[]> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/incident-reports/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getIncidentReportsByPatientIdPaginated(
    patientId: string,
    page = 0,
    size = 10,
    sortBy = 'incidentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<IncidentReport>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/incident-reports/patient/${patientId}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getIncidentReportsByType(
    incidentType: string,
    page = 0,
    size = 10,
    sortBy = 'incidentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<IncidentReport>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/incident-reports/type/${incidentType}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getIncidentReportsBySeverity(
    severity: string,
    page = 0,
    size = 10,
    sortBy = 'incidentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<IncidentReport>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/incident-reports/severity/${severity}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getIncidentReportsByStatus(
    status: string,
    page = 0,
    size = 10,
    sortBy = 'incidentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<IncidentReport>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/incident-reports/status/${status}`, {
      params: { page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getIncidentReportsByDateRange(
    startDate: string,
    endDate: string,
    page = 0,
    size = 10,
    sortBy = 'incidentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<IncidentReport>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/incident-reports/date-range`, {
      params: { startDate, endDate, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async searchIncidentReports(
    searchTerm: string,
    page = 0,
    size = 10,
    sortBy = 'incidentDate',
    sortDirection = 'desc'
  ): Promise<PaginatedResponse<IncidentReport>> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/nursing/incident-reports/search`, {
      params: { searchTerm, page, size, sortBy, sortDirection },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async createIncidentReport(request: CreateIncidentReportRequest): Promise<IncidentReport> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}/nursing/incident-reports`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async updateIncidentReport(id: string, request: UpdateIncidentReportRequest): Promise<IncidentReport> {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/nursing/incident-reports/${id}`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async deleteIncidentReport(id: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_BASE_URL}/nursing/incident-reports/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
